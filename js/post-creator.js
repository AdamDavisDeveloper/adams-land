import * as marked from "https://esm.sh/marked";

const publishPersonalsFF = true;

const publishedPersonals = [
  "2025-07-01",
  "2025-07-02",
];

function customMarkdownPreprocess(text) {
  return text
    .replace(/\[\>\](.*)/g, '> $1') 
    .replace(/\[\-\](.*)/g, '<span class="dim">$1</span>');
};

function createPostFrames() {
  publishedPersonals.map((post) => {
    const newPost = document.createElement("div");
    newPost.setAttribute('id', `post_${post}`)
    newPost.setAttribute('class', `post`);
    document.querySelector("#posts").appendChild(newPost);
    console.log(document.querySelector("#posts"));
  });
};

function CreatePersonals() {
  createPostFrames();
  publishedPersonals.forEach((post) => {
    fetch(`/town-post/personals/${post}.md`)
      .then(res => res.text())
      .then(text => {
        const pre = customMarkdownPreprocess(text);
        const html = marked.parse(pre);
        document.querySelector(`#post_${post}`).innerHTML = html;
    });
  });
};

if(publishPersonalsFF) CreatePersonals();
