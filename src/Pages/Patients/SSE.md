const form = document.getElementById("messageForm");
      const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = ""; // Clear previous
      function showMessage(type, chatMessage) {
        console.log(chatMessage.message);
        const div = document.createElement("div");
        div.className = "message" + " " + type;
        div.innerHTML = `<strong>${chatMessage.sender_id}</strong>: ${
          chatMessage.message || ""
        }`;
        if (chatMessage.file) {
          div.innerHTML += `<br><a href="${chatMessage.file}" target="_blank">:paperclip: File</a>`;
        }
        const chatBox = document.getElementById("chat-box");
        chatBox.appendChild(div);
      }
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const dataToSend = JSON.stringify(Object.fromEntries(formData));
        console.log(dataToSend);
        showMessage("sneder", Object.fromEntries(formData));
        try {
          const res = await fetch(`${baseurl}/chat/messages/send`, {
            method: "POST",
            body: dataToSend,
            headers: {
              Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace this with actual token
            },
          });
          const result = await res.json();
          //   alert(result.message || "Message sent!");
          form.reset();
        } catch (err) {
          alert("Failed to send message");
          console.error(err);
        }
      });
      // Receive messages from SSE
      const source = new EventSource(`${baseurl}/chat/stream?myid=1&otherid=2`);
      source.onmessage = function (event) {
        const data = JSON.parse(event.data);
        const chats = data || [];
        chats.forEach((chat) => {
          console.log(chat.sender_id);
          showMessage("reciever", chat);
        });
      };
      source.onerror = function (err) {
        console.error("SSE error", err);
      };