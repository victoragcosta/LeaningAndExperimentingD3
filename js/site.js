function generateRandomData() {
  let arr = [];
  let formatter = d3.format(">02~");
  let newNum = () => formatter(Math.floor(Math.random() * 20));
  for (let i = 0; i < 5 + Math.random() * 15; i++) {
    let num = newNum();
    while (arr.includes(formatter(num))) {
      num = newNum();
    }
    arr.push(num);
  }
  return arr;
}

class Chart {
  constructor() {
    let div = d3.select("#chart");

    let width = div.node().getBoundingClientRect().width;
    let margin = {
      top: 0,
      bottom: 0,
      left: 20,
      right: 5
    };
    this.svg = div.append("svg");
    this.chart = this.svg
      .attr("width", width)
      .attr("height", 33)
      .attr("font-family", "sans-serif")
      .attr("font-size", 20)
      .style("display", "block")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  }

  setData(data) {
    const t = this.svg.transition().duration(1000);
    const distance = 35;
    const yPos = 17,
      yExit = 26;

    let text = this.chart.selectAll("text");

    text = text
      .data(data, d => d)
      .join(
        enter =>
          enter
            .append("text")
            .attr("y", yPos - yExit)
            .attr("x", (d, i) => i * distance)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("fill", "green")
            .text(d => d)
            .call(text =>
              text
                .transition(t)
                .delay(750)
                .ease(d3.easeBounceOut)
                .attr("y", yPos)
                .transition()
                .duration(300)
                .ease(d3.easeExpIn)
                .style("fill", "black")
            ),
        update =>
          update.call(text =>
            text
              .transition(t)
              .ease(d3.easeExp)
              .attr("x", (d, i) => i * distance)
          ),
        exit =>
          exit.style("fill", "red").call(text =>
            text
              .transition(t)
              .ease(d3.easeExpOut)
              .attr("y", yPos + yExit)
              .remove()
          )
      );
  }
}

let chart = new Chart();
chart.setData(generateRandomData());
setInterval(() => {
  let data = generateRandomData();
  chart.setData(data);
}, 5000);
