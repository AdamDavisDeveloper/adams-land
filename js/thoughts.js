import Data from "../thoughts-data.js";
const AllThoughts = document.getElementById("ThoughtsCards");

function generateEntries(data) {
  data.reverse().forEach((entry) => {
    const thoughtsEntry = document.createElement("div");
    thoughtsEntry.classList.add("thoughts-entry");
    thoughtsEntry.innerHTML = `
        <div class="date-time">
        <h1>${entry.date}</h1>
        </div>
        <div class="content">
        <p>${entry.content}</p>
        </div>
    `;
    AllThoughts.appendChild(thoughtsEntry);
  });
}

generateEntries(Data);
