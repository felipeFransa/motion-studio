import { createServer } from 'vite';

async function run() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    ssr: {
      noExternal: ['@motion-canvas/2d', '@motion-canvas/core'],
    },
  });

  try {
    // Dynamically load the test script inside Vite's environment
    await server.ssrLoadModule('/scripts/test_brand_system_core.ts');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    await server.close();
  }
}

run();
