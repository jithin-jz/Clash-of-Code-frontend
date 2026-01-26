/* eslint-disable no-undef */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodide = null;

async function loadPyodideAndPackages() {
    try {
        pyodide = await loadPyodide();
        // Redirect stdout to main thread
        pyodide.setStdout({
            batched: (msg) => {
                postMessage({ type: 'log', content: msg });
            }
        });
        postMessage({ type: 'ready' });
    } catch (err) {
        postMessage({ type: 'error', content: `Failed to load Pyodide: ${err}` });
    }
}

loadPyodideAndPackages();

self.onmessage = async (event) => {
    const { type, code, testCode } = event.data;

    if (type === 'run') {
        if (!pyodide) {
             postMessage({ type: 'error', content: "Pyodide is not ready yet." });
             return;
        }

        try {
            // Run User Code
            await pyodide.runPythonAsync(code);
            
            // Run Test Code if exists
            if (testCode) {
                 try {
                     await pyodide.runPythonAsync(testCode);
                     postMessage({ type: 'success', content: "✅ Tests Passed!" });
                     postMessage({ type: 'completed', passed: true });
                 } catch (testError) {
                     postMessage({ type: 'error', content: `❌ Test Failed: ${testError.toString()}` });
                     postMessage({ type: 'completed', passed: false });
                 }
            } else {
                 postMessage({ type: 'log', content: "⚠️ No tests defined. Code ran successfully." });
                 postMessage({ type: 'completed', passed: false });
            }
        } catch (error) {
            postMessage({ type: 'error', content: `❌ ${error.toString()}` });
             postMessage({ type: 'completed', passed: false });
        }
    }
};
