document.getElementById("signupForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const res = await fetch("/api/auth/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    })
  });
  if (res.ok) window.location.href = "index.html";
  else {
    let msg = "Signup failed.";
    try {
      const result = await res.json();
      if (result.error) msg = result.error;
      if (msg.includes("UNIQUE constraint failed: users.username")) msg = "Username already taken.";
      if (msg.includes("UNIQUE constraint failed: users.email")) msg = "Email already registered.";
      if (msg.includes("required")) msg = "Please fill in all fields.";
    } catch {}
    alert(msg);
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const res = await fetch("/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    })
  });
  if (res.ok) window.location.href = "index.html";
  else alert("Login failed");
});
