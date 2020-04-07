class BarDisplay {
  /**
   * Creates an instance of BarDisplay and creates an svg for the graph
   *
   * @param {string} selector A CSS like selector representing the element to put the graph inside
   */
  constructor(selector) {
    this._data = [];

    let div = d3.select(selector);

    let width = div.node().getBoundingClientRect().width;
    let height = 300;
    let margin = {
      top: 5,
      bottom: 30,
      left: 5,
      right: 30,
    };
    this.svg = div.append("svg");
    this.chart = this.svg
      .attr("width", width)
      .attr("height", height)
      .attr("font-family", "sans-serif")
      .attr("fill", "steelblue")
      .style("display", "block")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    this.x = d3.scaleBand().rangeRound([0, width - margin.left - margin.right]);
    this.y = d3
      .scaleLinear()
      .rangeRound([0, height - margin.top - margin.bottom]);
    this.color = d3.scaleSequential(d3.interpolateBlues);

    this.xAxis = this.svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height - margin.bottom})`);

    this.yAxis = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right},${height - margin.bottom})`
      )
      .append("g")
      .attr("transform", "rotate(180)");
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;

    let values = data.map((e) => e.value);
    let yDomain = [0, d3.max(values)];
    let colorDomain = yDomain.slice();
    colorDomain[0] -= 5; // Darker Start

    this.x.domain(values);
    this.y.domain(yDomain);
    this.color.domain(colorDomain);

    const x = this.x;
    const y = this.y;
    const color = this.color;

    const t = this.svg.transition().duration(266);

    this.chart
      .selectAll("rect")
      .data(data, (d) => d.value)
      .join(
        (enter) =>
          enter
            .append("rect")
            .style("mix-blend-mode", "multiply")
            .attr("x", (d) => x(d.value))
            .attr("y", (d) => y(yDomain[1]))
            .attr("width", x.bandwidth())
            .attr("height", y(0))
            .style("fill", color(0))
            .call((rect) =>
              rect
                .transition(t)
                .delay(550)
                .attr("y", (d) => y(yDomain[1]) - y(d.value))
                .attr("height", (d) => y(d.value))
                .style("fill", (d) => {
                  if (d.color !== null) {
                    return d.color;
                  }
                  return color(d.value);
                })
            ),
        (update) =>
          update.call((rect) =>
            rect
              .transition(t)
              .delay(250)
              .attr("x", (d) => x(d.value))
              .attr("y", (d) => y(yDomain[1]) - y(d.value))
              .attr("width", x.bandwidth())
              .attr("height", (d) => y(d.value))
              .style("fill", (d) => {
                if (d.color !== null) {
                  return d.color;
                }
                return color(d.value);
              })
          ),
        (exit) =>
          exit.call((rect) =>
            rect
              .transition(t)
              .attr("y", y(yDomain[1]))
              .attr("height", y(0))
              .style("fill", color(0))
              .remove()
          )
      );
    this.xAxis.transition(t).delay(250).call(d3.axisBottom(x));
    this.yAxis
      .transition(t)
      .delay(250)
      .call(d3.axisLeft(y).ticks(d3.min([yDomain[1], 20])))
      .selectAll("text")
      .attr("x", 8)
      .style("text-anchor", "start")
      .attr("transform", "rotate(180)");
  }
}
