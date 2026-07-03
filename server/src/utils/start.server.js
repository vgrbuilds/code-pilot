const startServer = (app, port) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

export default startServer;