class ParagraphDisplay {
  /**
   * Creates an instance of ParagraphDisplay and inserts an svg at the selector element
   *
   * @constructor
   * @author victoragcosta
   * @param {string} selector A CSS like selector representing the element to put the display inside
   */
  constructor(selector) {
    this._data = [];

    let div = d3.select(selector);

    let width = div.node().getBoundingClientRect().width;
    let height = 33;
    let fontsize = d3.min([20, width * 0.03]);
    this.distance = d3.min([35, fontsize * 0.54]);
    let margin = {
      top: 0,
      bottom: 0,
      left: this.distance,
      right: this.distance,
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

  set data(data) {
    this._data = data;
    this.render();
  }

  setData(data, duration = 700) {
    this._data = data;
    this.render(duration);
  }

  render(duration = 1000) {
    const t = this.chart.transition().duration(duration);
    const yPos = 17;
    const yExit = 28;

    this.chart
      .selectAll("text")
      .data(this._data, (d) => d.value.toLowerCase())
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d, i) => {
              let x = 0;
              for (let j = i; j > 0; j--) {
                x += this._data[j - 1].value.length * this.distance;
              }
              return x;
            })
            .attr("y", yPos - yExit)
            .attr("dy", "0.35em")
            .style("text-anchor", "start")
            .style("fill", (d) => d.color)
            .style("font-weight", "700")
            .text((d) => d.value)
            .call((text) =>
              text
                .transition(t)
                .delay(200)
                .ease(d3.easeBounceOut)
                .attr("y", yPos)
            ),
        (update) =>
          update.call((text) =>
            text
              .transition(t)
              .ease(d3.easeExp)
              .text((d) => d.value)
              .attr("x", (d, i) => {
                let x = 0;
                for (let j = i; j > 0; j--) {
                  x += this._data[j - 1].value.length * this.distance;
                }
                return x;
              })
              .style("fill", (d) => d.color)
          ),
        (exit) =>
          exit.call((text) =>
            text
              .transition(t)
              .ease(d3.easeExpOut)
              .attr("y", yPos + yExit)
              .remove()
          )
      );
  }
}
