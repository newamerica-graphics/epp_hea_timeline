import React from "react";
import { Timeline } from "@newamerica/timeline";
import { ChartContainer, Title } from "@newamerica/meta";
import hyperlinker from "./lib/hyperlinker";
import "./index.css";

let queue = [];
let data = null;

const settings = {
  timeline: el => {
    const _data = data["Sheet1"].map(row => ({
      ...row,
      date: new Date(row.date),
      description: hyperlinker(row.description)
    }));
    ReactDOM.render(
      <ChartContainer full style={{ padding: "2rem 1rem" }}>
        <Title style={{ paddingBottom: "2rem" }}>
          Timeline of HEA Reauthorization
        </Title>
        <Timeline data={_data} divisionWidth={8.109} />
      </ChartContainer>,
      el
    );
  }
};

fetch("https://na-data-projects.s3.amazonaws.com/data/epp/hea_timeline.json")
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
