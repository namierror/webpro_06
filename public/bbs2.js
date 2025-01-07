"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');

// 投稿確認モーダル
const confirmationModal = document.querySelector('#confirmation-modal');
const confirmYes = document.querySelector('#confirm-yes');
const confirmNo = document.querySelector('#confirm-no');

let pendingPost = { name: '', message: '' }; // 一時保存用

//ここから投稿送信に関する処理

document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    pendingPost = { name, message }; // 投稿データを一時保存
    confirmationModal.style.display = 'block'; // モーダルを表示
});

confirmYes.addEventListener('click', () => {
    const { name, message } = pendingPost;

    const params = {
        method: "POST",
        body: 'name='+name+'&message='+message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/post";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(() => {
            document.querySelector('#message').value = "";
            confirmationModal.style.display = 'none'; // モーダルを非表示
        });
});

confirmNo.addEventListener('click', () => {
    confirmationModal.style.display = 'none'; // モーダルを非表示
    pendingPost = { name: '', message: '' }; // 一時保存データをクリア
});

//ここまでが投稿送信に関する処理

//ここから投稿表示に関する処理

document.querySelector('#check').addEventListener('click', () => {
    const url = "/check";
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    fetch(url, params)
        .then((response) => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then((response) => {
            const value = response.number;
            if (number != value) {
                const url = "/read";
                const params = {
                    method: "POST",
                    body: 'start='+number,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                fetch(url, params)
                    .then((response) => {
                        if (!response.ok) throw new Error('Error');
                        return response.json();
                    })
                    .then((response) => {
                        number += response.messages.length;
                        response.messages.forEach((mes, i) => {
                            const postId = number - response.messages.length + i;

                            const cover = document.createElement('div');
                            cover.className = 'cover';

                            const name_area = document.createElement('span');
                            name_area.className = 'name';
                            name_area.innerText = mes.name;

                            const mes_area = document.createElement('span');
                            mes_area.className = 'mes';
                            mes_area.innerText = mes.message;

                            // いいねボタン
                            const likeButton = document.createElement('input');
                            likeButton.type = 'button';
                            likeButton.id = `like-button-${postId}`;
                            likeButton.style.margin = "0px 0px 0px 30px";
                            likeButton.value = `いいね (${mes.likes || 0})`;

                            likeButton.addEventListener('click', () => {
                                const url = "/good";
                                const params = {
                                    method: "POST",
                                    body: 'postId='+postId,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                };
                                fetch(url, params)
                                    .then((response) => {
                                        if (!response.ok) throw new Error('Error');
                                        return response.json();
                                    })
                                    .then((response) => {
                                        // いいね数の更新
                                        likeButton.value = `いいね (${response.likes})`;
                                    });
                            });

                            // お気に入り登録ボタン
                            const favoriteButton = document.createElement('input');
                            favoriteButton.type = 'button';
                            favoriteButton.style.margin = "0px 0px 0px 30px";
                            favoriteButton.value = 'お気に入り登録';

                            favoriteButton.addEventListener('click', () => {
                                const url = "/favorite";
                                const params = {
                                    method: "POST",
                                    body: 'postId='+postId,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                };
                                fetch(url, params)
                                    .then((response) => {
                                        if (!response.ok) throw new Error('Error');
                                        return response.json();
                                    })
                                    .then(() => {
                                        alert('お気に入りに追加しました！');
                                    });
                            });

                            cover.appendChild(name_area);
                            cover.appendChild(mes_area);
                            cover.appendChild(likeButton);
                            cover.appendChild(favoriteButton);
                            bbs.appendChild(cover);
                        });
                    });
            }
        });
});

//ここまでが投稿表示に関する処理

// お気に入り一覧ボタン
document.querySelector('#showFavorites').addEventListener('click', () => {
    const url = "/getFavorites";
    fetch(url, { method: "POST" })
        .then((response) => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then((response) => {
            alert(`お気に入り一覧:\n${response.favorites.map(fav => fav.name + ': ' + fav.message).join('\n')}`);
        });
});

