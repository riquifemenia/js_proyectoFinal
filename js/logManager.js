class LogManager {
    constructor(filename) {
        this.logs = [];
        this.filename = filename;
    }

    addLog(log) {
        this.logs.push(log);
        this.writeLogsToFile();
    }

    getLogs() {
        return this.logs;
    }

    async writeLogsToFile() {
        const logString = this.logs.join('\n');

        try {
            const response = await fetch(`/writeLogs?filename=${encodeURIComponent(this.filename)}`, {
                method: 'POST',
                body: logString
            });

            if (response.ok) {
                console.log('Logs written to', this.filename);
            } else {
                console.error('Error writing logs to file:', response.statusText);
            }
        } catch (error) {
            console.error('Error writing logs to file:', error);
        }
    }
}

export default LogManager;
