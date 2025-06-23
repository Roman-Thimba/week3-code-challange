// my simulated data
const mockPosts = [
  {
    "id": 1,
      "title": "Car Spotting in Kileleshwa",
      "content": "Spent my weekend spotting the best rides in Kenya — and trust me, Nairobi doesn't disappoint!",
      "author": "Emily Carter",
      "image": "https://i.pinimg.com/736x/34/6b/25/346b25ab6c234c06d4969275588d57b9.jpg"
    },

  {
    "id": 2,
      "title": "Where I Spent My Weekend",
      "content": "Villa Rosa Kempinski is one of the most lavish hotels in Nairobi — and the experience was pure luxury.",
      "author": "David Kim",
      "image": "https://i.pinimg.com/736x/80/4a/e3/804ae3ced8176a5831be6cb1672ea0dc.jpg"
    },
  {
     "id": 3,
      "title": "A Weekend Guide to Nairobi, Kenya",
      "content": "From bustling markets to serene parks and delicious local cuisine, here's how to make the most of a weekend in Kenya’s vibrant capital...",
      "author": "Grace Njoroge",
      "image": "https://i.pinimg.com/736x/74/ad/ad/74adadbb0a5e498ff06181fa8d5fd2e0.jpg"
    },

    {
      "id": 4,
      "title": "Why Mindfulness Changed My Life",
      "content": "I used to rush through my days. Mindfulness helped me slow down, focus, and enjoy life more fully. Here’s what I learned...",
      "author": "Liam Thompson",
      "image": "https://i.pinimg.com/736x/3c/0e/62/3c0e6216b6c062a7c1f7cda5201e67cc.jpg"
    }
];

// Simulate server functions using Promises
const delay = (ms) => new Promise(res => setTimeout(res, ms));

function fetchPosts() {
  return delay(500).then(() => [...mockPosts]);
}

function fetchPostById(id) {
  return delay(300).then(() => {
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error("Post not found");
    return { ...post };
  });
}

function createPost(post) {
  return delay(300).then(() => {
    const id = Math.max(...mockPosts.map(p => p.id)) + 1;
    const newPost = { ...post, id };
    mockPosts.push(newPost);
    return newPost;
  });
}

function updatePost(post) {
  return delay(300).then(() => {
    const index = mockPosts.findIndex(p => p.id === post.id);
    if (index === -1) throw new Error("Post not found");
    mockPosts[index] = post;
    return post;
  });
}

function deletePost(id) {
  return delay(300).then(() => {
    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Post not found");
    mockPosts.splice(index, 1);
  });
}

// logic
function renderPosts() {
  const postList = document.getElementById("post-list");
  postList.innerHTML = `<div class="text-center text-gray-500"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;

  fetchPosts().then(posts => {
    postList.innerHTML = "";

    posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "post-item p-4 bg-gray-50 rounded-lg cursor-pointer flex items-center space-x-4 transition";
      div.dataset.id = post.id;

      div.innerHTML = `
        <img src="${post.image}" class="w-12 h-12 rounded-md object-cover" />
        <div>
          <h3 class="text-lg font-medium text-gray-800">${post.title}</h3>
          <p class="text-sm text-gray-500">By ${post.author}</p>
        </div>
      `;

      div.onclick = () => showPostDetails(post.id);
      postList.appendChild(div);
    });

    if (posts.length > 0) showPostDetails(posts[0].id);
  });
}

function showPostDetails(id) {
  const detail = document.getElementById("post-detail");
  const editForm = document.getElementById("edit-post-form");
  detail.innerHTML = `<div class="text-center text-gray-500"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;
  editForm.classList.add("hidden");

  fetchPostById(id).then(post => {
    detail.innerHTML = `
      <div class="fade-in text-left">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">${post.title}</h2>
            <p class="text-gray-600">By ${post.author}</p>
          </div>
          <div class="space-x-2">
            <button class="btn-primary text-sm" onclick="editPost(${post.id})"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn-secondary text-sm" onclick="removePost(${post.id})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
        <img src="${post.image}" class="mb-4 w-full h-60 object-cover rounded-lg" />
        <p class="text-gray-700">${post.content}</p>
      </div>
    `;
  });
}

function editPost(id) {
  const post = mockPosts.find(p => p.id === id);
  const form = document.getElementById("edit-post-form");
  const detail = document.getElementById("post-detail");
  detail.classList.add("hidden");
  form.classList.remove("hidden");

  form.dataset.id = id;
  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;
}

function removePost(id) {
  if (confirm("Delete this post?")) {
    deletePost(id).then(() => {
      renderPosts();
      document.getElementById("post-detail").innerHTML = `<p class="text-gray-500 text-center py-12">Select a post to view details</p>`;
    });
  }
}

function handleFormSubmissions() {
  document.getElementById("new-post-form").onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const author = document.getElementById("author").value;
    const image = document.getElementById("image").value;

    createPost({ title, content, author, image }).then(post => {
      renderPosts();
      document.getElementById("new-post-form").reset();
      showPostDetails(post.id);
    });
  };

  document.getElementById("edit-post-form").onsubmit = (e) => {
    e.preventDefault();
    const id = +e.target.dataset.id;
    const title = document.getElementById("edit-title").value;
    const content = document.getElementById("edit-content").value;

    updatePost({ id, title, content, author: "Unknown", image: "" }).then(() => {
      renderPosts();
      showPostDetails(id);
      document.getElementById("edit-post-form").classList.add("hidden");
      document.getElementById("post-detail").classList.remove("hidden");
    });
  };

  document.getElementById("cancel-edit").onclick = () => {
    document.getElementById("edit-post-form").classList.add("hidden");
    document.getElementById("post-detail").classList.remove("hidden");
  };

  document.getElementById("refresh-btn").onclick = renderPosts;
}

// Start web
document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
  handleFormSubmissions();
});

;


