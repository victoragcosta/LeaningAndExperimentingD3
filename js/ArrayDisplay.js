// D3 Array text display

/** @class ArrayDisplay a graph used to display arrays in text */
class ArrayDisplay {
  /**
   * Creates an instance of ArrayDisplay and add an svg to the chosen element
   *
   * @constructor
   * @author victoragcosta
   * @param {string} selector A CSS like selector indicating the element to insert the display
   */
  constructor(selector) {
    this._data = [];

    let div = d3.select(selector);

    let width = div.node().getBoundingClientRect().width;
    let height = 33;
    let fontsize = d3.min([20, width * 0.03]);
    this.distance = d3.min([35, fontsize * 1.6]);
    let margin = {
      top: 0,
      bottom: 0,
      left: this.distance * 0.8,
      right: this.distance * 0.8,
    };
    this.svg = div.append("svg");
    this.chart = this.svg
      .attr("width", width)
      .attr("height", height)
      .attr("font-family", "sans-serif")
      .attr("font-size", fontsize)
      .style("display", "block")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  }

  get data() {
    return this._data;
  }

  set data(newData) {
    this._data = newData;

    const t = this.svg.transition().duration(500);
    const yPos = 17;
    const yExit = 26;

    let text = this.chart.selectAll("text");

    text = text
      .data(newData, (d) => d.value)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d, i) => i * this.distance)
            .attr("y", yPos - yExit)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("fill", "green")
            .style("font-weight", "700")
            .text((d) => formatter(d.value))
            .call((text) =>
              text
                .transition(t)
                .delay(200)
                .ease(d3.easeBounceOut)
                .attr("y", yPos)
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .style("fill", (d) => d.color)
            ),
        (update) =>
          update.call((text) =>
            text
              .transition(t)
              .ease(d3.easeExp)
              .attr("x", (d, i) => i * this.distance)
              .style("fill", (d) => d.color)
          ),
        (exit) =>
          exit.style("fill", "red").call((text) =>
            text
              .transition(t)
              .ease(d3.easeExpOut)
              .attr("y", yPos + yExit)
              .remove()
          )
      );
  }
}
