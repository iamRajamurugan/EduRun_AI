interface ExecutionResult {
  output: string[];
  errors: string[];
  timestamp: Date;
  executionTime: number;
}

export const executeJavaScript = async (code: string): Promise<ExecutionResult> => {
  const startTime = Date.now();
  const output: string[] = [];
  const errors: string[] = [];

  // Create a safe execution environment
  const originalConsole = console.log;
  const originalError = console.error;

  // Capture console output
  console.log = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    output.push(message);
  };

  console.error = (...args: any[]) => {
    const message = args.map(arg => String(arg)).join(' ');
    errors.push(message);
  };

  try {
    // Create a safe execution context
    const safeGlobals = {
      console,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      Number,
      String,
      Boolean,
      Array,
      Object,
    };

    // Create a function that executes the code in a controlled environment
    const executeCode = new Function(
      ...Object.keys(safeGlobals),
      `"use strict"; ${code}`
    );

    // Execute the code with safe globals
    executeCode(...Object.values(safeGlobals));
    
  } catch (error) {
    if (error instanceof Error) {
      errors.push(`${error.name}: ${error.message}`);
    } else {
      errors.push(`Error: ${String(error)}`);
    }
  } finally {
    // Restore original console methods
    console.log = originalConsole;
    console.error = originalError;
  }

  const executionTime = Date.now() - startTime;

  return {
    output,
    errors,
    timestamp: new Date(),
    executionTime
  };
};