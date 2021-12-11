const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const taskInputWeightDOM = document.querySelector(".task-input-weight");
const formAlertDOM = document.querySelector(".form-alert");
// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const { data: tasks } = await axios.get("/api/v1/tasks");
    if (tasks.length < 1) {
      //https://www.w3schools.com/graphics/svg_intro.asp
      tasksDOM.innerHTML = `<h1 class="empty-list">  
      <style>
        .small { font: italic 5px sans-serif; }
      </style>

      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="5" fill="white"/>
        <text x="20" y="10" class="small" fill="white">No tasks in your list</text>
        <path d="M5 0 L35 20 L25 20 Z" fill="white"/>
        <rect width="10" height="10" fill="white" /> 
      </svg>
      <p style="font-size:100px"><ul><li>&#128540;</li></ul></p>
      <a href="https://nodejs.org/en/">Click Here </a> 
      </h1>`;
      loadingDOM.style.visibility = "hidden";
      return;
    }

    getTasks().then((value) => {
      let data1 = value; // Success!
      // A function that create / update the plot for a given variable:
      // set the color scale
      var color = d3.scaleOrdinal().domain(data1).range(d3.schemeDark2);
      // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      var radius = Math.min(width, height) / 2 - margin;

      // shape helper to build arcs:
      var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
      function update(data) {
        var pie = d3.pie().value(function (d) {
          return d.weight;
        });
        var data_ready = pie(data);

        // map to data
        var u = svg.selectAll("path").data(data_ready);

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        u.enter()
          .append("path")
          .merge(u)
          .transition()
          .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
          .attr("fill", function (d) {
            return color(d.data.weight);
          })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 1);

        // remove the group that is not present anymore
        u.exit().remove();

        svg
          .selectAll("path")
          .data(data_ready)
          .enter()
          .append("text")
          .text(function (d) {
            return "Task " + d.name;
          })
          .attr("transform", function (d) {
            return "translate(" + arcGenerator.centroid(d) + ")";
          })
          .style("text-anchor", "middle")
          .style("font-size", 17);
      }
      update(data1);
    });
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `<div class="single-task ${
          completed && "task-completed"
        } style="background-color:"">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
<!-- complete check btn -->
<button type="button" class="check_btn" data-id="${taskID}">
<i class="fas fa-check"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML = `<h5 class="empty-list">${error}</h5>`;
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  console.log(el);
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  // wrork here , now add redo button to make it uncomplete
  if (el.parentElement.classList.contains("check_btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      const { data } = await axios.get(`/api/v1/tasks/${id}`);
      let Checked = data.task;
      Checked.completed = true;
      await axios.patch(`/api/v1/tasks/${id}`, {
        name: Checked.name,
        completed: Checked.completed,
      });
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }

  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;
  const weight = taskInputWeightDOM.value;
  try {
    if (weight == "") {
      weight = 1;
    }
    await axios.post("/api/v1/tasks", { name, weight });
    showTasks();
    taskInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

const getTasks = async () => {
  try {
    const { data: tasks } = await axios.get("/api/v1/tasks");
    return tasks;
  } catch (error) {
    console.log(error);
  }
};

getTasks().then((value) => {
  let data1 = value; // Success!
  // A function that create / update the plot for a given variable:
  // set the color scale
  var color = d3.scaleOrdinal().domain(data1).range(d3.schemeDark2);
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
  function update(data) {
    var pie = d3.pie().value(function (d) {
      return d.weight;
    });
    var data_ready = pie(data);

    // map to data
    var u = svg.selectAll("path").data(data_ready);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u.enter()
      .append("path")
      .transition()
      .duration(1000)
      .merge(u)
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", function (d) {
        return color(d.data.weight);
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1);

    // remove the group that is not present anymore
    u.exit().remove();

    svg
      .selectAll("path")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        return "Task " + d.name;
      })
      .attr("transform", function (d) {
        return "translate(" + arcGenerator.centroid(d) + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);
  }

  update(data1);
});

//https://www.d3-graph-gallery.com/graph/pie_basic.html
// graph script
// set the dimensions and margins of the graph
var width = 200;
height = 200;
margin = 0;

// append the svg object to the div called 'my_dataviz'
var svg = d3
  .select(".my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("align", "center")
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
