function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
    
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // console.log("buildCharts")
    // console.log(data)
    // 3. Create a variable that holds the samples array. 
    
    var samples = data.samples;
    console.log(samples);
    // // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesNumber = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(data)
    // //  5. Create a variable that holds the first sample in the array.
    var firstSample = samplesNumber[0];
    console.log(firstSample)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var values = firstSample.sample_values;
    var labels = firstSample.otu_labels;
    var ids = firstSample.otu_ids;
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    

    var yticks = ids.slice(0, 10).map(otu_id => `otu_id ${otu_id}`).reverse();
      // console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var barData = [
      {
      x: values.slice(0, 10).reverse(),
      y: yticks,
      text: labels.slice(0, 10).reverse(),
      type:"bar",
      orientation: "h"}
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b>Top 10 Bacteria Cultures Found</b>", font: {size: 18}},
      font: {color: "indigo"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive:true});


    // Bubble Chart
    
    // 1. Create the trace for the bubble chart.
    var trace2 = 
      {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale: 'Electric'
      }
    };

    var bubbleData = [trace2];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: "<b>Bacteria Cultures Per Sample</b>", font: {size: 18}},
      xaxis: {title: "OTU ID"},
      hovermode: `closest`,
      font: {color: "indigo"}
      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive:true});
    
    //Gauge Chart
    
    // 1. variable that filters the metadata array for an object in the array whose id prperty matches
    // the ID number passed into the buildcharts()function as the argument
    var metaDataArray = data.metadata.filter(sampleData => sampleData.id == sample);
    
    // 2. 
    var freq = metaDataArray[0];
    console.log(freq)
    // 3. 
    var freqFloat = parseFloat(freq.wfreq);
    console.log(freqFloat)
    // 4. Create the trace for the gauge chart.
    var trace3 = 
     { 
      domain: {x:[0,1], y:[0,1]},
      value: freqFloat,
		  
		  type: "indicator",
		  mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], tickwidth: 1, tickcolor: "blue"},
        steps: [
          { range: [0, 2], color: "cyan"},
          { range: [2, 4], color: "olive"},
          { range: [4, 6], color: "gray"},
          { range: [6, 8], color: "pink"},
          { range: [8, 10], color: "brown"},
          
           ]
             }
     };
   
    
    
    // Create the gauge chart
    var gaugeData = [trace3];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>", font: {size: 18}},
      //title: { text: " Scrubs per Week"},
      width: 500,
      hight: 400,
      margins: {t: 25, r:25, l:25, b:25},
      font: {color: "indigo"}
		  
    };

    // 6. Use Plotly to plot the gauge data and layout.
    
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive:true});

  });
} 