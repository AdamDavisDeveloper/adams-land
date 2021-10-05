import thoughtsData from "../thoughts-data.js";
import dreamsData from "../dreams-data.js";
// HTML DOM Parents
const AllThoughts = document.getElementById("ThoughtsCards");
const AllDreams = document.getElementById("DreamCards");

function generateEntries(data, parent, type) {
  data.reverse().forEach((ent) => {
    const Entry = document.createElement("div");
    Entry.classList.add(`${type}-entry`);
    Entry.innerHTML = `
        <div class="date-time">
        <h1>${ent.date}</h1>
        </div>
        <div class="content">
        <p>${ent.content}</p>
        </div>
    `;
    parent.appendChild(Entry);
  });
}

// HTML CONDITIONALS
if (AllThoughts) {
  generateEntries(thoughtsData, AllThoughts, "thought");
}
if (AllDreams) {
  generateEntries(dreamsData, AllDreams, "dream");
}
