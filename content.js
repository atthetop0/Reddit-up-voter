chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    if (request.run_reddit_upvoter === true) {

        window.addEventListener('scroll', get_upvote_buttons, true);
        sendResponse({
            enabled: "Enabled"
        });
    } else {
        window.removeEventListener("scroll", get_upvote_buttons, true);
        sendResponse({
            disabled: "Disabled"
        });
    }
});

chrome.storage.sync.get('run_reddit_upvoter', function (data) {
    if (data.run_reddit_upvoter === true) {

        window.addEventListener('scroll', get_upvote_buttons, true);
    } else {
        window.removeEventListener("scroll", get_upvote_buttons, true);
    }
});

var get_upvote_buttons = function () {
    chrome.storage.sync.get('upvote_random', function (data) {
        if (data.upvote_random != undefined) {
            if (data.upvote_random === true) {
                just_upvote(true);
            } else {
                just_upvote(false);
            }
        }
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function just_upvote(rand) {
    if (document.body.innerHTML.search("sign up</a>") == -1) {
        chrome.runtime.sendMessage({
            message: 'Working!'
        });
    } else {
        chrome.runtime.sendMessage({
            message: 'You are not logged in.'
        });
        return;
    }
    var toUpvote = document.querySelectorAll("button[aria-pressed='false'][aria-label='upvote']");
    //var toUpvote = document.querySelectorAll("button[aria-pressed='false'][aria-label='upvote']:not([style='border: 1px solid yellow;'])") //for testing
    if (toUpvote.length > 0) {
        if (rand === true) {
            if (getRandomInt(100) > 8) {
                return;
            }
            var max = getRandomInt(toUpvote.length);
            var min;
            if (max <= 1) {
                return;
            } else {
                min = (max - 1);
            }

        } else {
            var max = toUpvote.length;
            var min = 0;
        }
        for (i = min; i <= max; i++) {
            if (toUpvote[i] != undefined) {
                if (isInViewport(toUpvote[i])) {
                    toUpvote[i].click();
                    //toUpvote[i].style.border = '1px solid yellow'; //for testing
                }
            }
        }
    }
}

var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth));
};
