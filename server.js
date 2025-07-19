const express = require('express');
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const PORT = process.env.PORT || 3000;

// Token bot Telegram anda
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Fail untuk simpan user
const usersFile = path.join(__dirname, 'users.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));
  if (users[username] && users[username].password === password) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

// /create username user_id
bot.onText(/\/create (\w{3,}) (\d+)/, (msg, match) => {
  const adminId = msg.from.id;
  if (adminId !== 8042961678) return; // Tukar ke ID anda

  const username = match[1];
  const userId = parseInt(match[2]);
  const users = JSON.parse(fs.readFileSync(usersFile));

  if (users[username]) {
    return bot.sendMessage(adminId, `❌ Username <code>${username}</code> telah wujud.`, { parse_mode: 'HTML' });
  }

  const password = Math.random().toString(36).slice(-8);
  users[username] = {
    password,
    created_by: adminId,
    created_at: new Date().toISOString()
  };

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  bot.sendMessage(userId, 
    `✅ Akun Anda Telah Dibuat!\n👤 Username: <code>${username}</code>\n🔐 Password: <code>${password}</code>\n🌐 Login: https://your-domain.com`, 
    { parse_mode: 'HTML' }
  );

  bot.sendMessage(adminId, `✅ Akaun <b>${username}</b> berjaya dibuat dan dihantar ke <code>${userId}</code>`, { parse_mode: 'HTML' });
});

// /delete username
bot.onText(/\/delete (\w{3,})/, (msg, match) => {
  const adminId = msg.from.id;
  const username = match[1];
  const users = JSON.parse(fs.readFileSync(usersFile));

  if (!users[username]) {
    return bot.sendMessage(adminId, `❌ Username <code>${username}</code> tidak dijumpai.`, { parse_mode: 'HTML' });
  }

  delete users[username];
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  bot.sendMessage(adminId, `🗑️ Akaun <code>${username}</code> telah dipadam.`, { parse_mode: 'HTML' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});er { background-color: #111; }

    .selected-type {
      font-size: 14px;
      color: lime;
      margin-bottom: 20px;
    }

    .overlay {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      justify-content: center;
      align-items: center;
      z-index: 999;
    }

    .popup-box {
      background-color: #111;
      border: 2px solid red;
      border-radius: 20px;
      padding: 30px;
      width: 80%;
      max-width: 400px;
      text-align: center;
    }

    .popup-box h3 { color: #00FF00; margin-bottom: 10px; }
    .popup-box p { color: white; font-size: 14px; margin-bottom: 20px; }

    .ok-btn {
      background-color: black;
      border: 1px solid red;
      color: red;
      padding: 10px 25px;
      font-family: 'Orbitron', sans-serif;
      border-radius: 10px;
      cursor: pointer;
    }

    #attackPage { display: none; }
    #attackPage.active { display: block; }
  </style>
</head>
<body>

  <!-- Login Page -->
  <div class="login-container" id="loginPage">
    <div class="login-box">
      <h2>Login Access</h2>
      <input type="text" id="username" class="login-input" placeholder="Username">
      <input type="password" id="password" class="login-input" placeholder="Password">
      <button class="login-btn" onclick="login()">LOGIN</button>
    </div>
  </div>

  <!-- Attack Page -->
  <div id="attackPage">
    <div class="top-bar">Attack Menu</div>

    <div class="logo">
      <img src="https://files.catbox.moe/c3mhg4.jpg" alt="silent logo" width="130">
    </div>

    <div class="attack-title">Attack Menu</div>

    <input type="text" id="targetNumber" class="input-box" placeholder="Target number (e.g. +62xxxxxxx)">

    <div class="type-bug-btn" onclick="toggleBugMenu()">Type Bug ♡</div>

    <div class="bug-menu" id="bugMenu">
      <div class="bug-item" onclick="selectBug('Combo All')">Combo All</div>
      <div class="bug-item" onclick="selectBug('Crash Force')">Crash Force</div>
      <div class="bug-item" onclick="selectBug('Hard Delay Super')">Hard Delay Super</div>
      <div class="bug-item" onclick="selectBug('IOS Crash')">IOS CRASH</div>
      <div class="bug-item" onclick="selectBug('Android UI Killer')">Android Crash</div>
    </div>

    <div class="selected-type" id="selectedBug"></div>

    <button class="send-btn" onclick="sendBug()">▶ SEND BUG</button>

    <!-- Popup -->
    <div class="overlay" id="popupOverlay">
      <div class="popup-box">
        <h3>✅ Success</h3>
        <p id="popupText">Bug sent successfully.</p>
        <button class="ok-btn" onclick="closePopup()">OK</button>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script>
    let bugMenuOpen = false;
    let selectedBugType = "";

    function toggleBugMenu() {
      const menu = document.getElementById("bugMenu");
      menu.style.display = bugMenuOpen ? "none" : "block";
      bugMenuOpen = !bugMenuOpen;
    }

    function selectBug(bugName) {
      selectedBugType = bugName;
      document.getElementById("selectedBug").innerText = `Selected: ${bugName}`;
      document.getElementById("bugMenu").style.display = "none";
      bugMenuOpen = false;
    }

    function sendBug() {
      const number = document.getElementById("targetNumber").value;
      if (!number || !selectedBugType) {
        alert("Please enter target number and select bug!");
        return;
      }

      const token = "7979847471:AAH_FRt5idhKww_jOWDiYjdRVc1fKCcJMmQ";
      const chatId = "8042961678";
      const text = `⚠️ Bug Request Detected\n📱 Target: ${number}\n💥 Bug Type: ${selectedBugType}`;

      const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=HTML`;

      fetch(url)
        .then(() => {
          // Simulasi delay konfirmasi dari owner
          setTimeout(() => {
            document.getElementById("popupText").innerText = `✅ Bug "${selectedBugType}" sent to ${number}.`;
            document.getElementById("popupOverlay").style.display = "flex";
          }, 15000); // 15 detik delay
        });
    }

    function closePopup() {
      document.getElementById("popupOverlay").style.display = "none";
    }

    function login() {
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;

      if (user === "herysuhu" && pass === "herysuhu1") {
        document.getElementById("loginPage").remove();
        document.getElementById("attackPage").classList.add("active");
      } else {
        alert("Login failed! Username or password incorrect.");
      }
    }
  </script>
</body>
</html>