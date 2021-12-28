import thoughtsData from "../thoughts-data.js";
import dreamsData from "../dreams-data.js";
import quotesData from "../quotes-data.js";
// HTML DOM Parents
const AllThoughts = document.getElementById("ThoughtsCards");
const AllDreams = document.getElementById("DreamCards");
const AllQuotes = document.getElementById("SayingsColumn");

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

function generateQuotes(data) {
	data.reverse().forEach((ent) => {
		const Entry = document.createElement("div");
		Entry.innerHTML = `
        <div class="content">
          <p class="content-tag">${ent.content}</p>
          <p class="author-tag">${ent.author}</p>
        </div>
    `;
		AllQuotes.appendChild(Entry);
	});
}

// HTML CONDITIONALS
if (AllThoughts) {
	generateEntries(thoughtsData, AllThoughts, "thought");
}
if (AllDreams) {
	generateEntries(dreamsData, AllDreams, "dream");
}
if (AllQuotes) {
	generateQuotes(quotesData);
}
