function _1(md){return(
md`# Data Visualization Assignment`
)}

function _d3(require){return(
require("d3")
)}

async function _data(FileAttachment){return(
await FileAttachment("temperature_daily.csv").csv()
)}

async function _csvdata(FileAttachment){return(
await FileAttachment("temperature_daily.csv").text()
)}

function _5(csvdata){return(
csvdata.slice(0, 100)
)}

function _parsedData(d3,csvdata){return(
d3.csvParse(csvdata.trim())
)}

function _7(Inputs,parsedData){return(
Inputs.table(parsedData.slice(0, 5))
)}

function _8(parsedData){return(
parsedData.slice(0,5)
)}

function _processedData(d3,parsedData){return(
d3.rollups(
  parsedData,
  v => ({
    maxTemp: d3.max(v, d => +d.max_temperature),
    minTemp: d3.min(v, d => +d.min_temperature)
  }),
  d => {
    let parsedDate = d3.timeParse("%Y-%m-%d")(d.date); // Fix format here
    return parsedDate ? d3.timeFormat("%Y")(parsedDate) : "Invalid Year"; // Extract Year
  },
  d => {
    let parsedDate = d3.timeParse("%Y-%m-%d")(d.date); // Fix format here
    return parsedDate ? d3.timeFormat("%m")(parsedDate) : "Invalid Month"; // Extract Month
  }
)
)}

function _10(Inputs,processedData){return(
Inputs.table(processedData)
)}

function _finalData(processedData){return(
processedData.flatMap(([year, months]) =>
  months.map(([month, { maxTemp, minTemp }]) => ({
    year: +year,      // Convert to number to avoid formatting issues
    month: +month,    // Convert month to number
    maxTemp,
    minTemp
  }))
)
)}

function _12(finalData){return(
finalData[0]
)}

function _13(Inputs,finalData){return(
Inputs.table(finalData)
)}

function _14(finalData){return(
finalData.slice(0,5)
)}

function _15(md){return(
md`Until above everything seems fine`
)}

function _chart(d3,finalData)
{
  const width = 1000;  // Increased width
  const height = 600;  // Increased height
  const margin = { top: 40, right: 80, bottom: 100, left: 100 }; // Adjusted margins

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height);

  // Scales
  const x = d3.scaleBand()
      .domain(finalData.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.1);

  const y = d3.scaleBand()
      .domain([...Array(12).keys()].map(d => d + 1)) // Months (1-12)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

  const color = d3.scaleSequential()
      .domain([d3.min(finalData, d => d.maxTemp), d3.max(finalData, d => d.maxTemp)])
      .interpolator(d3.interpolateWarm);

  // Draw heatmap squares
  svg.selectAll("rect")
      .data(finalData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.month))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.maxTemp))
      .attr("stroke", "#fff");

  // **🛠 Fixed: X-Axis with Rotated Labels**
  svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("transform", "rotate(-45)") // **Rotate labels**
      .style("text-anchor", "end");

  // **🛠 Fixed: Y-Axis (Months)**
  svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d3.timeFormat("%B")(new Date(2000, d - 1, 1))));

  // **🔥 Tooltip Fix**
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("visibility", "hidden");

  svg.selectAll("rect")
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`Year: ${d.year}<br>Month: ${d.month}<br>Max: ${d.maxTemp}°C<br>Min: ${d.minTemp}°C`);
    })
    .on("mousemove", (event) => {
      tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  // **🛠 Fixed: Enlarged & Centered Color Legend**
  const legendWidth = 300; // Increased size
  const legendHeight = 15;
  const legendX = width / 2 - legendWidth / 2; // Centering
  const legendY = height - 60; // Move it above x-axis

  const legendScale = d3.scaleLinear()
    .domain([d3.min(finalData, d => d.maxTemp), d3.max(finalData, d => d.maxTemp)])
    .range([0, legendWidth]);

  const legendAxis = d3.axisBottom(legendScale).ticks(5);

  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d3.interpolateWarm(0));

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d3.interpolateWarm(1));

  const legend = svg.append("g")
    .attr("transform", `translate(${legendX},${legendY})`);

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legend.append("g")
    .attr("transform", `translate(0,${legendHeight})`)
    .call(legendAxis);

  return svg.node();
}


function _17(md){return(
md`# LEVEL 2`
)}

async function _dailyRawData(FileAttachment){return(
await FileAttachment("temperature_daily.csv").csv()
)}

function _19(Inputs,dailyRawData){return(
Inputs.table(dailyRawData.slice(0, 10))
)}

function _parseDate(d3){return(
d3.timeParse("%Y-%m-%d")
)}

function _dailyParsedData(dailyRawData,parseDate){return(
dailyRawData.map(d => {
  let parsedDate = parseDate(d.date.trim());
  return parsedDate ? {
    date: parsedDate,
    year: parsedDate.getFullYear(),
    month: parsedDate.getMonth() + 1,  
    day: parsedDate.getDate(),
    maxTemp: +d.max_temperature,
    minTemp: +d.min_temperature
  } : null;
}).filter(d => d !== null)
)}

function _22(Inputs,dailyParsedData){return(
Inputs.table(dailyParsedData.slice(0, 10))
)}

function _23(Inputs,dailyRawData,parseDate){return(
Inputs.table(dailyRawData.map(d => ({
  rawDate: d.date, 
  parsedDate: parseDate(d.date.trim())
})).slice(0, 10))
)}

function _chart1(d3,dailyParsedData)
{
  const width = 1200;  // Increased width
  const height = 700;  // Increased height
  const margin = { top: 40, right: 80, bottom: 100, left: 100 }; // Adjusted margins

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height);

  // **Fix: Ensure x-domain covers all unique years**
  const x = d3.scaleBand()
      .domain([...new Set(dailyParsedData.map(d => d.year))])  // Unique years
      .range([margin.left, width - margin.right])
      .padding(0.1);

  const y = d3.scaleBand()
      .domain([...Array(12).keys()].map(d => d + 1)) // Months (1-12)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

  // **Fix: Use consistent color scaling for max temp**
  const color = d3.scaleSequential()
      .domain([d3.min(dailyParsedData, d => d.maxTemp), d3.max(dailyParsedData, d => d.maxTemp)])
      .interpolator(d3.interpolateWarm);

  // **Fix: Ensure grouped data correctly maps year-month**
  const groupedData = d3.group(dailyParsedData, d => `${d.year}-${String(d.month).padStart(2, "0")}`);

  // **Draw heatmap squares**
  const cells = svg.selectAll("g")
      .data([...groupedData])
      .enter()
      .append("g")
      .attr("transform", ([key, values]) => {
        const [year, month] = key.split("-");
        return `translate(${x(+year)},${y(+month)})`;
      });

  cells.append("rect")
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", ([, values]) => color(d3.max(values, d => d.maxTemp)))
      .attr("stroke", "#fff");

  // **Fix: Draw two mini-line charts (Max Temp - Red, Min Temp - Blue)**
  const line = d3.line()
      .x(d => d3.scaleLinear().domain([1, 31]).range([0, x.bandwidth()])(d.day)) // Scale within cell
      .y(d => d3.scaleLinear().domain([
        d3.min(dailyParsedData, d => d.minTemp), 
        d3.max(dailyParsedData, d => d.maxTemp)
      ]).range([y.bandwidth(), 0])(d.maxTemp));  // Flipped y-axis for correct orientation

  cells.append("path")
      .attr("d", ([, values]) => line(values))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5);

  // **Fix: Draw Min Temp Line**
  const lineMin = d3.line()
      .x(d => d3.scaleLinear().domain([1, 31]).range([0, x.bandwidth()])(d.day))
      .y(d => d3.scaleLinear().domain([
        d3.min(dailyParsedData, d => d.minTemp), 
        d3.max(dailyParsedData, d => d.maxTemp)
      ]).range([y.bandwidth(), 0])(d.minTemp));

  cells.append("path")
      .attr("d", ([, values]) => lineMin(values))
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5);

  // **🛠 Fixed: X-Axis with Rotated Labels**
  svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  // **🛠 Fixed: Y-Axis (Months)**
  svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d3.timeFormat("%B")(new Date(2000, d - 1, 1))));

  // **🔥 Tooltip Fix**
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("visibility", "hidden");

  cells.on("mouseover", (event, [key, values]) => {
      const sampleData = values[0];  // Sample from the group
      tooltip.style("visibility", "visible")
        .html(`Year: ${sampleData.year}<br>
               Month: ${sampleData.month}<br>
               Max: ${d3.max(values, d => d.maxTemp)}°C<br>
               Min: ${d3.min(values, d => d.minTemp)}°C`);
    })
    .on("mousemove", (event) => {
      tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  // **🛠 Fixed: Enlarged & Centered Color Legend**
  const legendWidth = 300;
  const legendHeight = 15;
  const legendX = width / 2 - legendWidth / 2;
  const legendY = height - 60;

  const legendScale = d3.scaleLinear()
    .domain([d3.min(dailyParsedData, d => d.maxTemp), d3.max(dailyParsedData, d => d.maxTemp)])
    .range([0, legendWidth]);

  const legendAxis = d3.axisBottom(legendScale).ticks(5);

  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d3.interpolateWarm(0));

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d3.interpolateWarm(1));

  const legend = svg.append("g")
    .attr("transform", `translate(${legendX},${legendY})`);

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legend.append("g")
    .attr("transform", `translate(0,${legendHeight})`)
    .call(legendAxis);

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["temperature_daily.csv", {url: new URL("./files/b14b4f364b839e451743331d515692dfc66046924d40e4bff6502f032bd591975811b46cb81d1e7e540231b79a2fa0f4299b0e339e0358f08bef900595e74b15.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("csvdata")).define("csvdata", ["FileAttachment"], _csvdata);
  main.variable(observer()).define(["csvdata"], _5);
  main.variable(observer("parsedData")).define("parsedData", ["d3","csvdata"], _parsedData);
  main.variable(observer()).define(["Inputs","parsedData"], _7);
  main.variable(observer()).define(["parsedData"], _8);
  main.variable(observer("processedData")).define("processedData", ["d3","parsedData"], _processedData);
  main.variable(observer()).define(["Inputs","processedData"], _10);
  main.variable(observer("finalData")).define("finalData", ["processedData"], _finalData);
  main.variable(observer()).define(["finalData"], _12);
  main.variable(observer()).define(["Inputs","finalData"], _13);
  main.variable(observer()).define(["finalData"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("chart")).define("chart", ["d3","finalData"], _chart);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("dailyRawData")).define("dailyRawData", ["FileAttachment"], _dailyRawData);
  main.variable(observer()).define(["Inputs","dailyRawData"], _19);
  main.variable(observer("parseDate")).define("parseDate", ["d3"], _parseDate);
  main.variable(observer("dailyParsedData")).define("dailyParsedData", ["dailyRawData","parseDate"], _dailyParsedData);
  main.variable(observer()).define(["Inputs","dailyParsedData"], _22);
  main.variable(observer()).define(["Inputs","dailyRawData","parseDate"], _23);
  main.variable(observer("chart1")).define("chart1", ["d3","dailyParsedData"], _chart1);
  return main;
}
