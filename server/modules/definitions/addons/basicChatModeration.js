// Very basic spam prevention.
// Adds a simple ratelimit for sending too many messages.
// Allows you to spam if you have the allowSpam flag in your permissions.

let recent = {},
	ratelimit = 3,
	decay = 10_000;

Events.on('chatMessage', ({ message, socket, preventDefault, setMessage }) => {
	let perms = socket.permissions,
		id = socket.player.body.id;

	// Here we block out some very bad and banned word by replacing it with asterisks,
	// then we set the message that will be seen by others to that filtered message.
  let bannedWords = ['nigger', 'nigga', 'faggot', 'tranny', 'dyke', 'sieg heil', 'blowjob', 'boobs', 'boobies', 'porn', 'pornhub', 'porno', 'orgasm', 'dildo', 'cock', 'dick', 'cum', 'orgy', 'hoe', 'hentai', 'hanime', 'whore', 'boner'];
  function checkMessage(message) {
    bannedWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        message = message.replace(regex, '******');
    });
    return message;
  }
	setMessage(checkMessage(message));

	// They are allowed to spam ANYTHING they want INFINITELY.
	if (perms && perms.allowSpam) return;

	// If they're talking too much, they can take a break.
	// Fortunately, this returns false if 'recent[id] is 'undefined'.
	if (recent[id] >= ratelimit) {
		preventDefault(); // 'preventDefault()' prevents the message from being sent.
		socket.talk('m', Config.MESSAGE_DISPLAY_TIME, 'Please slow down!');
		return;
	}

	// The more messages they send, the higher this counts up.
	if (!recent[id]) {
		recent[id] = 0;
	}
	recent[id]++;

	// Let it decay so they can talk later.
	setTimeout(() => {
		recent[id]--;

		// memoree leak NOes!
		if (!recent[id]) {
			delete recent[id];
		}
	}, decay);

	// If message above the character limit, lets stop that from getting through
	if (message.length > 256) {
		preventDefault();
		socket.talk('m', Config.MESSAGE_DISPLAY_TIME, 'Too long!')
	}
});

console.log('[basicChatModeration] Loaded spam prevention!');