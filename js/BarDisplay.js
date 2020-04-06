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
      bottom: 5,
      left: 5,
      right: 5,
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

    this.chart
      .selectAll("rect")
      .data(data, (d) => d.value)
      .join(
        (enter) => enter.append("rect").style("mix-blend-mode", "multiply"),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("x", (d) => x(d.value))
      .attr("y", (d) => y(yDomain[1]) - y(d.value))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => y(d.value))
      .style("fill", (d) => {
        if (d.color !== null) {
          return d.color;
        }
        return color(d.value);
      });
  }
}
