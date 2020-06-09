var enable_disable = document.querySelector("input[id=run]");
var random_enable_disable = document.querySelector("input[id=random]");
var all_enable_disable = document.querySelector("input[id=all]");
enable_disable.checked = false;
random_enable_disable.checked = false;
all_enable_disable.checked = false;
random_enable_disable.disabled = true;
all_enable_disable.disabled = true;


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    if (request.message !== undefined) {
        document.getElementById('messages').innerHTML = request.message;
    }
});

enable_disable.addEventListener('change', function () {
    if (this.checked) {
        chrome.storage.sync.set({
            run_reddit_upvoter: true
        });
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                run_reddit_upvoter: true
            }, function (response) {
                document.getElementById('text').innerHTML = response.enabled;
            });
        });
		
        document.getElementById('random').disabled = false;
        document.getElementById('all').disabled = false;
		
		random_enable_disable.checked = true;
		all_enable_disable.checked = false;
    } else {
        chrome.storage.sync.set({
            run_reddit_upvoter: false
        });
        document.getElementById('random').disabled = true;
        document.getElementById('all').disabled = true;
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                run_reddit_upvoter: false
            }, function (response) {
                document.getElementById('text').innerHTML = response.disabled;
            });
        });
    }
});

random_enable_disable.addEventListener('change', function () {
    if (this.checked) {
        chrome.storage.sync.set({
            upvote_random: true
        });
        all_enable_disable.checked = false;
        document.getElementById('messages').innerHTML = "";
        chrome.storage.sync.set({
            upvote_all: false
        });
    } else {
        chrome.storage.sync.set({
            upvote_random: false
        });
        random_enable_disable.checked = true;
        chrome.storage.sync.set({
            upvote_random: true
        });
    }
});

all_enable_disable.addEventListener('change', function () {
    if (this.checked) {
        chrome.storage.sync.set({
            upvote_all: true
        });
        random_enable_disable.checked = false;
        chrome.storage.sync.set({
            upvote_random: false
        });
        document.getElementById('messages').innerHTML = "Choosing 'All' may result in 429 'Too Many Requests' errors";
    } else {
        chrome.storage.sync.set({
            upvote_all: false
        });
        random_enable_disable.checked = true;
        chrome.storage.sync.set({
            upvote_all: true
        });
        document.getElementById('messages').innerHTML = "";
    }
});
chrome.storage.sync.get('run_reddit_upvoter', function (data) {
    if (data.run_reddit_upvoter != undefined) {
        if (data.run_reddit_upvoter === true) {
            document.getElementById('run').checked = true;
            document.getElementById('text').innerHTML = 'Enabled';
            document.getElementById('random').disabled = false;
            document.getElementById('all').disabled = false;
            chrome.storage.sync.get('upvote_all', function (data) {
                if (data.upvote_all != undefined) {
                    if (data.upvote_all === true) {
                        document.getElementById('all').checked = true;
                    } else {
                        document.getElementById('all').checked = false;
                    }
                }
            });
            chrome.storage.sync.get('upvote_random', function (data) {
                if (data.upvote_random != undefined) {
                    if (data.upvote_random === true) {
                        document.getElementById('random').checked = true;
                    } else {
                        document.getElementById('random').checked = false;
                    }
                } else {
                    document.getElementById('random').checked = true;
                }
            });
        } else {
            document.getElementById('run').checked = false
                document.getElementById('text').innerHTML = 'Disabled';
            document.getElementById('random').disabled = true;
            document.getElementById('all').disabled = true;
        }
    }
});
