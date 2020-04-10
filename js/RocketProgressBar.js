class RocketProgressBar {
  /**
   * Creates an instance of RocketProgressBar and creates an svg for the graph
   *
   * @constructor
   * @author victoragcosta
   * @param {string} selector A CSS like selector representing the element to put the graph inside
   */
  constructor(selector) {
    this._data = 0;

    let div = d3.select(selector);

    this.width = div.node().getBoundingClientRect().width;
    this.height = 400;
    this.margin = {
      top: 190,
      bottom: 0,
      left: 0,
      right: 0,
    };

    this.svg = div.append("svg");

    // Create graph with 0,0 at the bottom center
    this.chart = this.svg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("font-family", "sans-serif")
      .attr("fill", "steelblue")
      .style("display", "block")
      .append("g")
      .attr(
        "transform",
        `translate(${this.width / 2},${this.height - this.margin.bottom})` +
          " scale(1,-1)"
      );

    this.y = d3
      .scaleLinear()
      .clamp(false)
      .domain([0, 1])
      .rangeRound([0, this.height - this.margin.top - this.margin.bottom]);

    // Create graphical elements
    this.createElements();
    // Render animations and positioning
    this.render();
  }

  axisGenerator(
    scale,
    transition,
    ticks,
    length = 50,
    thickness = 4,
    outerSize = 120
  ) {
    return (chart) => {
      chart
        .selectAll("g.ticks")
        .data(ticks, d3.format("~%"))
        .join(
          (enter) =>
            enter
              .append("g")
              .call((g) =>
                g
                  .append("rect")
                  .style("fill", "currentColor")
                  .transition(transition)
                  .attr("x", -length / 2)
                  .attr("y", -thickness)
                  .attrTween("width", function () {
                    return function (t) {
                      return Math.abs(t * length);
                    };
                  })
                  .attrTween("height", function () {
                    return function (t) {
                      return Math.abs(t * thickness);
                    };
                  })
              )
              .call((g) =>
                g
                  .append("line")
                  .style("stroke", "currentColor")
                  .style("stroke-width", "0.5")
                  .transition(transition)
                  .attr("x1", (d, i) => (i % 2 ? -length / 2 : length / 2))
                  .attr("y1", -thickness / 2)
                  .attr("x2", (d, i) => (i % 2 ? -outerSize : outerSize))
                  .attr("y2", -thickness / 2)
              )
              .call((g) =>
                g
                  .append("text")
                  .style("fill", "currentColor")
                  .attr("transform", "scale(1,-1)")
                  .attr("y", thickness)
                  .attr("dy", "-0.35em")
                  .style("font-size", "0em")
                  .style("text-anchor", (d, i) => (i % 2 ? "start" : "end"))
                  .transition(transition)
                  .attr("x", (d, i) => (i % 2 ? -outerSize : outerSize))
                  .style("font-size", "1.5em")
                  .text(d3.format("~%"))
              ),
          (update) =>
            update
              .call((g) =>
                g
                  .select("line")
                  .transition(transition)
                  .attr("x1", (d, i) => (i % 2 ? -length / 2 : length / 2))
                  .attr("x2", (d, i) => (i % 2 ? -outerSize : outerSize))
              )
              .call((g) =>
                g
                  .select("text")
                  .transition(transition)
                  .attr("x", (d, i) => (i % 2 ? -outerSize : outerSize))
                  .style("text-anchor", (d, i) => (i % 2 ? "start" : "end"))
              ),
          (exit) =>
            exit
              .transition(transition)
              .call((g) =>
                g
                  .select("rect")
                  .attr("x", 0)
                  .attrTween("width", function () {
                    return function (t) {
                      return Math.abs((1 - t) * length);
                    };
                  })
                  .attrTween("height", function () {
                    return function (t) {
                      return Math.abs((1 - t) * thickness);
                    };
                  })
              )
              .call((g) =>
                g
                  .select("line")
                  .attr("x1", 0)
                  .attr("y1", 0)
                  .attr("x2", 0)
                  .attr("y2", 0)
              )
              .call((g) =>
                g.select("text").attr("x", 0).style("font-size", "0em")
              )
              .remove()
        )
        .attr("class", "ticks")
        .attr("opacity", "1")
        .attr("transform", (d) => `translate(0,${scale(d)})`);
    };
  }

  // TODO: Create Rocket
  createRocket(element) {
    element.append("path").attr(
      "d",
      `M28.99 83.68
    C28.99 83.93 28.98 85.15 28.97 87.35
    C28.45 87.69 28.16 87.88 28.1 87.92
    C17.54 95.01 7.29 110.32 2.31 126.48
    C0.91 131.02 -0.11 136.36 0.01 138.66
    C0.04 139.31 0.09 139.09 0.14 138.04
    C0.07 139.96 0.07 139.96 0.02 140.8
    C-0.03 141.91 0.37 144.27 0.81 145.41
    C2.44 149.55 5.88 151.32 10.43 150.37
    C12.51 149.93 13.54 149.57 18.21 147.58
    C25.22 144.59 28.41 143.6 33.6 142.8
    C33.77 142.77 34.61 142.64 36.14 142.41
    C36.64 143.04 36.92 143.39 36.98 143.46
    C39.51 146.61 42.71 148.49 47.68 149.68
    C48.35 149.83 48.94 150.01 48.96 150.03
    C49 150.08 48.67 150.55 48.22 151.11
    C45.36 154.65 44 159.01 44.41 163.32
    C45.24 172.26 51.64 185.2 57.39 189.64
    C62.13 193.29 65.77 193.75 70.05 191.23
    C76.31 187.52 82.66 176.69 84.82 166.06
    C85.98 160.24 84.98 155.66 81.52 151.32
    C80.86 150.47 80.3 149.73 80.29 149.69
    C80.27 149.65 80.85 149.5 81.56 149.33
    C85.02 148.56 88.69 146.78 90.91 144.81
    C91 144.74 91.44 144.34 92.24 143.63
    C93.42 143.67 94.07 143.69 94.21 143.69
    C99.56 143.86 104.76 145.08 111.32 147.73
    C114.58 149.06 117.47 149.98 119.19 150.26
    C119.28 150.27 119.77 150.36 120.64 150.51
    C124.74 146.28 124.96 146.12 127.05 144.01
    C127.2 143.86 127.98 143.08 129.39 141.68
    C129.37 139.85 129.36 138.84 129.36 138.63
    C129.37 136.97 129.21 134.74 129.03 133.67
    C126.81 120.21 119.17 104.88 110.17 95.87
    C107.6 93.3 106.04 92.07 103.14 90.27
    C103.01 90.19 102.38 89.81 101.24 89.12
    C101.21 86.26 101.2 84.67 101.19 84.35
    C101.12 78.97 100.8 74.97 100.06 69.79
    C96.84 47.26 86.07 22.84 71.95 6.06
    C69.36 2.99 66.19 0.38 64.69 0.07
    C63.52 -0.17 62.85 0.16 61.38 1.67
    C60.11 2.97 60.1 3.01 60.94 2.39
    C57.64 5.55 57.2 5.93 56.36 6.79
    C55.2 7.93 54.31 9.01 52.92 10.98
    C38.58 31.48 29.26 59.84 28.99 83.68
    Z`
    );
  }

  createSmoke(element, scale = 1.8) {
    let smokeColor = "#cbcbcb";
    // Create path
    let path = element
      .append("path")
      .attr(
        "d",
        "m 10 0 v 10 c 0 14 -8 7 -5 4 c -6 1 -5 9 0 9 c 1 0 3 1 7 -3 c 4 4 6 3 7 3 c 5 0 6 -8 0 -9 c 3 3 -5 10 -5 -4 v -10 z "
      )
      .attr("opacity", "0.9")
      .style("mix-blend-mode", "multiply")
      .style("fill", smokeColor);

    // Get size
    let { width, height } = path.node().getBBox();

    // align 0,0 to mid bottom and scale up
    path.attr(
      "transform",
      `translate(${(-width * scale) / 2},${
        height * scale
      }) scale(${scale},${-scale})`
    );

    // Add growing bar
    element
      .append("rect")
      .style("fill", smokeColor)
      .attr("opacity", 0.9)
      .attr("x", -scale * 1.2)
      .attr("y", 23 * scale)
      .attr("width", scale * 4)
      .attr("height", 10);
  }

  createElements() {
    // Create axis Y
    this.yAxis = this.chart.append("g");

    // Create smokes
    this.smokes = this.chart.append("g").attr("class", "smokes");
    let smoke = this.smokes.append("g").attr("class", "smoke");
    let scale = 1.5;
    this.createSmoke(smoke.attr("transform", "translate(3,10)"), scale);

    smoke = this.smokes.append("g").attr("class", "smoke");
    scale = 2;
    this.createSmoke(smoke.attr("transform", "translate(15,0)"), scale);

    smoke = this.smokes.append("g").attr("class", "smoke");
    scale = 1.8;
    this.createSmoke(smoke.attr("transform", "translate(-15,3)"), scale);

    // Create rocket container
    this.rocket = this.chart.append("g");
    // Add rocket to svg
    this.createRocket(this.rocket);
    // Calculate rocket size
    let bBox = this.rocket.select("path").node().getBBox();
    this.rocketWidth = bBox.width;
    this.rocketHeight = bBox.height;
    // Center rocket
    this.rocket
      .select("path")
      .attr(
        "transform",
        `translate(${-this.rocketWidth / 2},${this.rocketHeight * 0.78})` +
          " scale(1,-1)"
      );

    this.yAxis = this.yAxis
      .attr("transform", `translate(0,${this.rocketHeight * 0.78})`)
      .append("g");
  }

  render(duration = 2000) {
    // Create a new transition to synchronize everything
    const y = this.y;
    const t = this.svg.transition().duration(duration).ease(d3.easeBack);

    // Recalculate and ajust ticks
    let min = d3.min([y.domain()[0], this._data]);
    let max = d3.max([y.domain()[1], this._data]);
    let yAxisGen = this.axisGenerator(
      y,
      t,
      d3.ticks(min, max, (max - min) * 10)
    );
    this.yAxis.call(yAxisGen);

    // Move rocket to correct height
    this.rocket
      .transition(t)
      .attr("transform", `translate(0,${y(this._data)})`);

    // Adjust smoke length to match rocket position
    let data = this._data;
    let oldData = this._oldData;
    let oldHeight = +this.smokes.select("rect").attr("height");
    this.smokes
      .selectAll("rect")
      .transition(t)
      .attrTween("height", function () {
        return function (t) {
          let out = (y(data) - oldHeight) * t + oldHeight;
          if (out >= 0) return out;
          return 0;
        };
      });

    // Adjust size of the smoke end when too close to the ground
    this.smokes.transition(t).attrTween("transform", function () {
      return function (t) {
        return `scale(${d3.min([
          1,
          d3.max([0, (1 / 0.2) * ((data - oldData) * t + oldData)]),
        ])})`;
      };
    });

    // Move the scale in case the rocket extrapolates the domain
    if (this._data > y.domain()[1] || this._data < y.domain()[0]) {
      this.chart
        .transition(t)
        .attr(
          "transform",
          `translate(${this.width / 2},${
            this.margin.top + y(this._data) - this.margin.bottom
          })` + " scale(1,-1)"
        );
    } else {
      this.chart
        .transition(t)
        .attr(
          "transform",
          `translate(${this.width / 2},${this.height - this.margin.bottom})` +
            " scale(1,-1)"
        );
    }
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._oldData = this._data;
    this._data = data;
    this.render();
  }

  setData(data, duration) {
    this._oldData = this._data;
    this._data = data;
    this.render(duration);
  }
}
