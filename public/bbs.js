"use strict";

let number = 0;
const bbs = document.querySelector("#bbs");

document.querySelector("#post").addEventListener("click", () => {
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;

    fetch("/post", {
        method: "POST",
        body: `name=${name}&message=${message}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(checkNewPosts); // 投稿後に自動で新規投稿を読み込む
});

document.querySelector("#check").addEventListener("click", checkNewPosts);

function checkNewPosts() {
    fetch("/read", { 
        method: "POST", 
        body: `start=${number}`, 
        headers: { "Content-Type": "application/x-www-form-urlencoded" } 
    })
    .then(res => res.json())
    .then(data => {
        data.messages.forEach(addMessageToDOM);
        number += data.messages.length;
    });
}

function addMessageToDOM(mes) {
    const template = document.querySelector("#post-template").content.cloneNode(true);
    const cover = template.querySelector(".cover");
    const nameArea = template.querySelector(".name");
    const mesArea = template.querySelector(".mes");
    const likeButton = template.querySelector(".like-button");
    const likeCount = template.querySelector(".like-count");
    const editButton = template.querySelector(".edit-button");
    const deleteButton = template.querySelector(".delete-button");

    nameArea.textContent = mes.name;
    mesArea.textContent = mes.message;
    likeCount.textContent = mes.likes || 0;

    editButton.addEventListener("click", () => editMessage(mes, mesArea));
    likeButton.addEventListener("click", () => likeMessage(mes.id, likeCount));
    deleteButton.addEventListener("click", () => deleteMessage(mes.id, cover));

    bbs.appendChild(cover);
}

function editMessage(mes, mesArea) {
    const newMessage = prompt("新しいメッセージを入力してください:", mes.message);
    if (newMessage && newMessage !== mes.message) {
        fetch("/edit", {
            method: "POST",
            body: `id=${mes.id}&message=${newMessage}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).then(() => (mes.message = mesArea.textContent = newMessage));
    }
}

function likeMessage(id, likeCount) {
    fetch("/like", {
        method: "POST",
        body: `id=${id}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(res => res.json())
    .then(data => (likeCount.textContent = data.likes));
}

function deleteMessage(id, cover) {
    if (confirm("この投稿を削除しますか?")) {
        fetch("/delete", {
            method: "POST",
            body: `id=${id}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).then(() => cover.remove());
    }
}