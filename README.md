[KCD's How to Enable React Concurrent Mode](https://kentcdodds.com/blog/how-to-enable-react-concurrent-mode)

```javascript
const rootEl = document.getElementById("root");
// ReactDOM.render(<App />, rootEl)
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
```

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
