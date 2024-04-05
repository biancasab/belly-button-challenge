const starter = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
d3.json(starter).then(function(data) {
    console.log(data);
});

// Function to create bar chart
function createBarChart(data) {
    var sampleValues = data.sample_values.slice(0, 10).reverse();
    var otuIDs = data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var otuLabels = data.otu_labels.slice(0, 10).reverse();
    
    console.log(sampleValues);
    console.log(otuIDs);
    console.log(otuLabels);

    var trace = {
      x: sampleValues,
      y: otuIDs,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };
    
    var layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
    
    Plotly.newPlot("bar", [trace], layout);
  }
  
  // Function to create bubble chart
  function createBubbleChart(data) {
    var trace = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    };
    
    var layout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
    
    Plotly.newPlot("bubble", [trace], layout);
  }
  
  // Function to display metadata
  function displayMetadata(metadata) {
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }
  
  // Function to handle dropdown change
  function optionChanged(sample) {
    d3.json(starter).then((data) => {
      var selectedSample = data.samples.find(entry => entry.id === sample);
      var selectedMetadata = data.metadata.find(entry => entry.id === parseInt(sample));
      
      createBarChart(selectedSample);
      createBubbleChart(selectedSample);
      displayMetadata(selectedMetadata);
    });
  }

  console.log(sample);

// Function to initialize the dashboard
function init() {
    //Select the dropdown menu
    var dropdown = d3.select("#selDataset");

    //Use the D3 library to read in samples.json
    d3.json(starter).then((data) => {
        var sampleNames = data.names
        //Populate the dropdown with sample names
        sampleNames.forEach((sample) => {
            dropdown 
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Initial sample
    var initialSample = sampleNames[0];
    optionChanged(initialSample);


    // Event listener for dropdown change
        dropdown.on("change", function() {
        const selectedSample = dropdown.property("value");
        createBarChart(selectedSample, data);
        // buildMetadata(selectedSample, data);
    });

        }).catch((error) => {
        console.log("Error loading data:", error);
    });
}

//Initialize the dashboard
init();

