import React, { Component } from "react";

interface IState {
  counter: number;
}

export default class Counter extends Component<{}, IState> {
  state = {
    counter: 0,
  };

  increase = () => {
    this.setState((s) => ({
      counter: s.counter + 1,
    }));
  };

  decrease = () => {
    this.setState((s) => ({
      counter: s.counter - 1,
    }));
  };

  render() {
    const { counter } = this.state;
    return (
      <div className="counter-wrapper">
        <button onClick={this.decrease}>Decrease</button>
        <span className="counter">{counter}</span>
        <button onClick={this.increase}>Increase</button>

        <style jsx>{`
          .counter-wrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          button {
            min-width: 100px;
            padding: 4px 10px;
          }
        `}</style>
      </div>
    );
  }
}
