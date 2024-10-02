let context = '';

export const setLoggingContext = (newContext: string) => {
    context = newContext;
}

const colors: Record<string, string> = {
    'EVAL': 'color: gray',
    'EXEC': 'color: green'
};

export function log(...args: any[]) {
    if (!context) {
        console.log(...args);
    } else {
        console.log(`%c[${context}]`, colors[context], ...args);
    }
}