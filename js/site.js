let formatter = d3.format(">02~");

function generateRandomData(min = 0, max = 20, size = null) {
  let arr = [];
  let newNum = () => min + Math.floor(Math.random() * (max - min));
  if (!size) size = 5 + Math.random() * 15;
  for (let i = 0; i < size; i++) {
    let num = newNum();
    while (arr.map((e) => e.value).includes(num)) {
      num = newNum();
    }
    arr.push({ value: num, color: "black" });
  }
  return arr;
}

function delay(ms) {
  return new Promise((resolve) => setInterval(resolve, ms));
}

class ArrayDisplay {
  constructor(selector) {
    this._data = [];

    let div = d3.select(selector);

    let width = div.node().getBoundingClientRect().width;
    let margin = {
      top: 0,
      bottom: 0,
      left: 20,
      right: 5,
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

  get data() {
    return this._data;
  }

  set data(newData) {
    this._data = newData;

    const t = this.svg.transition().duration(500);
    const distance = 35;
    const yPos = 17;
    const yExit = 26;

    let text = this.chart.selectAll("text");

    text = text
      .data(newData, (d) => d.value)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d, i) => i * distance)
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
              .attr("x", (d, i) => i * distance)
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

let randomNumbers = new ArrayDisplay("#number-display");
randomNumbers.data = generateRandomData();
setInterval(() => {
  randomNumbers.data = generateRandomData();
}, 2500);

let bubbleSort = new ArrayDisplay("#bubble-sort-display");
async function bubbleSorting(arr, selectedColor = "red", baseColor = "black") {
  let items = arr.slice();
  bubbleSort.data = items;
  await delay(800);
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length - 1 - i; j++) {
      items[j].color = selectedColor;
      items[j + 1].color = selectedColor;
      bubbleSort.data = items;
      await delay(800);

      if (items[j].value > items[j + 1].value) {
        let t = items[j];
        items[j] = items[j + 1];
        items[j + 1] = t;
        bubbleSort.data = items;
        await delay(800);
      }

      items[j].color = baseColor;
      items[j + 1].color = baseColor;
      bubbleSort.data = items;
      await delay(800);
    }
  }
}

let bubbleSortBlocked = false;
async function showBubbleSort() {
  if (!bubbleSortBlocked) {
    bubbleSortBlocked = true;
    d3.select('button[onclick="showBubbleSort()"]').node().disabled = true;
    this.disabled = true;
    await bubbleSorting(
      d3.shuffle(d3.range(1, 16)).map((e) => {
        return { value: e, color: "black" };
      })
    );
    bubbleSortBlocked = false;
    d3.select('button[onclick="showBubbleSort()"]').node().disabled = false;
  }
}
