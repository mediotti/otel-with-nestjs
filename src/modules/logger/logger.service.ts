import { Injectable, Scope } from '@nestjs/common';
import api from '@opentelemetry/api';
import { Logger } from 'nestjs-pino';

export enum LogLevel {
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
  Debug = 'debug',
  Verbose = 'verbose',
}

@Injectable({ scope: Scope.TRANSIENT })
export class SpanLogger extends Logger {
  /**
   * Logs a message with the specified log level and adds an event to the active trace span.
   * Automatically enriches the log attributes with the calling class, method, and line number.
   *
   * @param level - The level of the log ('log', 'warn', 'error', 'debug', or 'verbose').
   * @param message - The log message to be recorded.
   *
   * @throws Error - If an invalid log level is provided.
   */
  log(message: string, level: LogLevel = LogLevel.Log) {
    // Infer the calling class, method, and line number
    const stack = new Error().stack;
    const callerInfo = this.extractCallerInfo(stack);

    const enrichedAttributes = {
      class: callerInfo.className,
      method: callerInfo.methodName,
      line: callerInfo.lineNumber,
    };

    const activeSpan = api.trace.getSpan(api.context.active());
    if (activeSpan) {
      activeSpan.addEvent(message, enrichedAttributes, Date.now());
    }

    const logMethod = this[level];
    if (typeof logMethod === 'function') {
      logMethod.call(this, message);
    } else {
      throw new Error(`Invalid log level: ${level}`);
    }
  }

  /**
   * Extracts information about the caller (class name, method name, and line number)
   * from the stack trace.
   *
   * @param stack - The stack trace from which to extract caller information.
   * @returns An object containing the class name, method name, and line number of the caller.
   *          If the information cannot be determined, returns 'Unknown' for the respective fields.
   */
  private extractCallerInfo(stack: string | undefined): {
    className: string;
    methodName: string;
    lineNumber: string;
  } {
    if (!stack)
      return {
        className: 'Unknown',
        methodName: 'Unknown',
        lineNumber: 'Unknown',
      };

    // Parse the stack trace to extract caller information
    const stackLines = stack.split('\n');
    const callerLine = stackLines[2]; // Adjust this index if necessary based on your stack trace structure

    // Match standard stack trace formats
    const match =
      callerLine.match(/at (.+) \((.+):(\d+):\d+\)/) ||
      callerLine.match(/at (.+):(\d+):\d+/);
    if (match) {
      const fullMethod = match[1];
      const lineNumber = match[3] || 'Unknown';

      // Use reflection to determine the class name (if available)
      const className = fullMethod.includes('.')
        ? fullMethod.split('.')[0]
        : 'Unknown';

      return {
        className: className || 'Unknown',
        methodName: fullMethod.split('.').pop() || 'Unknown',
        lineNumber: lineNumber,
      };
    }

    return {
      className: 'Unknown',
      methodName: 'Unknown',
      lineNumber: 'Unknown',
    };
  }
}
