/**
 * Performance Testing Script for Lazy Loading Implementation
 * 
 * This script tests the lazy loading performance improvements
 * Run with: node scripts/test-lazy-loading.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testLazyLoadingPerformance() {
	console.log('🚀 Starting Lazy Loading Performance Test...\n');

	const browser = await puppeteer.launch({
		headless: false, // Set to true for CI/CD
		devtools: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	// Enable performance monitoring
	await page.setCacheEnabled(false);
	await page.setViewport({ width: 1920, height: 1080 });

	// Collect performance metrics
	const metrics = {
		initialLoad: {},
		lazyLoading: {},
		images: [],
		sections: []
	};

	// Monitor network requests
	const networkRequests = [];
	page.on('request', request => {
		networkRequests.push({
			url: request.url(),
			resourceType: request.resourceType(),
			timestamp: Date.now()
		});
	});

	// Monitor console logs for our performance tracking
	const performanceLogs = [];
	page.on('console', msg => {
		if (msg.text().includes('Lazy Loading Performance') || 
			msg.text().includes('Image loaded')) {
			performanceLogs.push({
				text: msg.text(),
				timestamp: Date.now()
			});
		}
	});

	try {
		console.log('📊 Testing initial page load...');
		const startTime = Date.now();

		// Navigate to home page
		await page.goto('http://localhost:3000', { 
			waitUntil: 'networkidle0',
			timeout: 30000 
		});

		const initialLoadTime = Date.now() - startTime;
		metrics.initialLoad.totalTime = initialLoadTime;

		// Measure Core Web Vitals
		const vitals = await page.evaluate(() => {
			return new Promise((resolve) => {
				new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const vitals = {};
					
					entries.forEach((entry) => {
						if (entry.entryType === 'largest-contentful-paint') {
							vitals.LCP = entry.startTime;
						}
						if (entry.entryType === 'first-input') {
							vitals.FID = entry.processingStart - entry.startTime;
						}
						if (entry.entryType === 'layout-shift') {
							vitals.CLS = (vitals.CLS || 0) + entry.value;
						}
					});
					
					setTimeout(() => resolve(vitals), 3000);
				}).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
			});
		});

		metrics.initialLoad.vitals = vitals;

		console.log(`✅ Initial load completed in ${initialLoadTime}ms`);
		console.log(`📈 Core Web Vitals:`, vitals);

		// Test lazy loading by scrolling
		console.log('\n🔄 Testing lazy loading behavior...');
		
		// Scroll slowly to trigger lazy loading
		await page.evaluate(() => {
			return new Promise((resolve) => {
				let scrollTop = 0;
				const scrollHeight = document.body.scrollHeight;
				const viewportHeight = window.innerHeight;
				
				const scroll = () => {
					scrollTop += viewportHeight / 4;
					window.scrollTo(0, scrollTop);
					
					if (scrollTop >= scrollHeight) {
						resolve();
					} else {
						setTimeout(scroll, 500); // Slow scroll to trigger lazy loading
					}
				};
				
				scroll();
			});
		});

		// Wait for lazy loading to complete
		await page.waitForTimeout(3000);

		// Count images and sections loaded
		const imageCount = await page.evaluate(() => {
			return document.querySelectorAll('img').length;
		});

		const sectionCount = await page.evaluate(() => {
			return document.querySelectorAll('[class*="Section"]').length;
		});

		metrics.lazyLoading.imagesLoaded = imageCount;
		metrics.lazyLoading.sectionsLoaded = sectionCount;

		// Analyze network requests
		const imageRequests = networkRequests.filter(req => req.resourceType === 'image');
		const initialImageRequests = imageRequests.filter(req => 
			req.timestamp - startTime < 3000 // First 3 seconds
		);
		const lazyImageRequests = imageRequests.filter(req => 
			req.timestamp - startTime >= 3000 // After 3 seconds
		);

		metrics.images = {
			total: imageRequests.length,
			initial: initialImageRequests.length,
			lazy: lazyImageRequests.length,
			lazyPercentage: ((lazyImageRequests.length / imageRequests.length) * 100).toFixed(2)
		};

		console.log(`🖼️ Images: ${metrics.images.total} total, ${metrics.images.initial} initial, ${metrics.images.lazy} lazy (${metrics.images.lazyPercentage}%)`);

		// Final performance measurement
		const finalMetrics = await page.metrics();
		metrics.finalMetrics = finalMetrics;

		console.log('\n📊 Final Performance Metrics:');
		console.log(`- JS Heap Used: ${(finalMetrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
		console.log(`- DOM Nodes: ${finalMetrics.Nodes}`);
		console.log(`- Event Listeners: ${finalMetrics.JSEventListeners}`);

		// Save detailed report
		const report = {
			timestamp: new Date().toISOString(),
			metrics,
			performanceLogs,
			networkRequests: networkRequests.length,
			recommendations: generateRecommendations(metrics)
		};

		const reportPath = path.join(__dirname, '..', 'performance-report.json');
		fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

		console.log(`\n📄 Detailed report saved to: ${reportPath}`);
		console.log('\n🎉 Performance test completed!');

	} catch (error) {
		console.error('❌ Error during performance test:', error);
	} finally {
		await browser.close();
	}
}

function generateRecommendations(metrics) {
	const recommendations = [];

	if (metrics.initialLoad.totalTime > 3000) {
		recommendations.push('Consider reducing initial bundle size or implementing more aggressive code splitting');
	}

	if (metrics.images.lazyPercentage < 60) {
		recommendations.push('Increase lazy loading coverage for images');
	}

	if (metrics.initialLoad.vitals.LCP > 2500) {
		recommendations.push('Optimize Largest Contentful Paint (LCP) - consider image optimization or preloading critical resources');
	}

	if (metrics.initialLoad.vitals.CLS > 0.1) {
		recommendations.push('Reduce Cumulative Layout Shift (CLS) - ensure proper image dimensions and avoid layout shifts');
	}

	if (recommendations.length === 0) {
		recommendations.push('Performance looks good! Consider monitoring in production for real-world metrics.');
	}

	return recommendations;
}

// Run the test
if (require.main === module) {
	testLazyLoadingPerformance().catch(console.error);
}

module.exports = { testLazyLoadingPerformance };
