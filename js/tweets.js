async function loadTweets() {
  const remove24h = localStorage.getItem('remove24h') === 'on';
  const res = await fetch(`/api/tweets${remove24h ? '?remove24h=on' : ''}`);
  const tweets = await res.json();
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
  tweets.forEach(t => {
    const div = document.createElement("div");
    div.className = "tweet";
    let mediaHtml = "";
    if (t.media && t.mediaType) {
      if (t.mediaType.startsWith("image")) {
        mediaHtml = `<img src='${t.media}' style='max-width:100%;max-height:320px;border-radius:12px;margin-top:8px;box-shadow:0 2px 12px #1d9bf0aa;'>`;
      } else if (t.mediaType.startsWith("video")) {
        mediaHtml = `<video src='${t.media}' controls style='max-width:100%;max-height:320px;border-radius:12px;margin-top:8px;box-shadow:0 2px 12px #1d9bf0aa;'></video>`;
      }
    }
    div.innerHTML = `
      <img src='https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png' class='tweet-avatar' alt='avatar'>
      <div class='tweet-content'>
        <div class='tweet-header'>
          <span class='tweet-username'>@${t.username}</span>
          <span class='tweet-date'>${new Date(t.createdAt).toLocaleString()}</span>
        </div>
        <div class='tweet-body'>${t.content}</div>
        ${mediaHtml}
        <div class='tweet-actions' style='margin-top:10px;display:flex;gap:18px;'>
          <button class='like-btn' data-id='${t.id}' title='Like' style='background:none;border:none;cursor:pointer;color:#1d9bf0;font-size:1.1em;'>❤️ Like (${t.likes || 0})</button>
        </div>
      </div>
    `;
    // Like button handler
    div.querySelector('.like-btn').onclick = async function(e) {
      e.preventDefault();
      console.log('Liking tweet ID:', t.id);
      const res = await fetch(`/api/tweets/${t.id}/like`, { method: 'POST', credentials: 'include' });
      if (res.ok) loadTweets();
      else alert('Failed to like tweet');
    };
    feed.appendChild(div);
  });
}


document.getElementById("tweetForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const content = document.getElementById("tweetContent").value.trim();
  const mediaInput = document.getElementById("tweetMedia");
  let mediaUrl = "";
  let mediaType = "";
  if (mediaInput.files[0]) {
    const mediaData = new FormData();
    mediaData.append("media", mediaInput.files[0]);
    const uploadRes = await fetch("/api/upload/media", {
      method: "POST",
      body: mediaData
    });
    if (uploadRes.ok) {
      const uploadJson = await uploadRes.json();
      mediaUrl = uploadJson.url;
      mediaType = uploadJson.type;
    } else {
      alert("Media upload failed");
      return;
    }
  }
  if (!content && !mediaUrl) {
    alert("Please enter text or select an image/video.");
    return;
  }
  const res = await fetch("/api/tweets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content, media: mediaUrl, mediaType })
  });
  const result = await res.json();
  if (!res.ok) {
    let msg = result.error || "Failed to post tweet.";
    if (msg.includes("Tweet must have text or media")) {
      msg = "Please enter some text or select an image/video before posting.";
    }
    if (msg.includes("Not logged in")) {
      msg = "You must be logged in to post a tweet.";
    }
    alert(msg);
    return;
  }
  document.getElementById("tweetContent").value = "";
  mediaInput.value = "";
  loadTweets();
});

loadTweets();
