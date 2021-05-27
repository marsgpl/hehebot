<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xmlns:og="http://opengraphprotocol.org/schema/">
<head>
	<title>Hentai Heroes</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, viewport-fit=cover" />
	<meta name="apple-mobile-web-app-capable" content="yes" /><meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="Hentai Heroes">

	<link rel="apple-touch-icon" href="/appz/img/apple-touch-icon-hh.png">
	<link rel="apple-touch-startup-image" href="/appz/img/screen-hh.png">

	<script type="text/javascript" src="https://www.hentaiheroes.com/js/screenfull.js?v=62202915"></script>
	<link href="https://hh2.hh-content.com/pictures/design/ic_favicon_32px.png" rel="icon" type="image/png" />
			<style>
			html, body { overflow: hidden }
			html, body {
				border: none;
				width: 100%;
				height: 100%;
				padding: 0;
				margin: 0;
			}
			iframe#hh_game {
				width: 100%;
				height: 100%;
				border: none;
				display: block;
				padding: 0;
				margin: 0;
			}
		</style>



    <script>
        window.addEventListener("message", function(event) {
            document.getElementById('hh_game').contentWindow.postMessage(event.data, "https://www.hentaiheroes.com/");
        }, false);
    </script>




<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link rel="preload" as="style" href="//fonts.googleapis.com/css?family=Carter+One|Kalam:700|Mr+Dafoe|Alegreya+Sans:700i|Marck+Script">

<link rel="stylesheet" media="print" onload="this.onload=null;this.removeAttribute('media');" href="//fonts.googleapis.com/css?family=Carter+One|Kalam:700|Mr+Dafoe|Alegreya+Sans:700i|Marck+Script">

<noscript>
	<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Carter+One|Kalam:700|Mr+Dafoe|Alegreya+Sans:700i|Marck+Script">
</noscript>




	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

		<link rel="stylesheet" type="text/css" media="screen" href="https://www.hentaiheroes.com/css/chat.css?v=62202912" />

	<script>
		// All these variable are also defined in \Platforms\NutakuPlatformIntegration::handleGadget()
		var IMAGES_URL = 'https://hh2.hh-content.com';
		var CHAT_CHANNEL = 'hentai';
		var ALLOWED_IFRAME_MESSAGE_TARGET = "https://www.hentaiheroes.com";
		var GAME_FEATURE_CLUB = true;

				$(function(){
			club_tabs.tabs = {
				chat_block: {
					view_version: 'default',
					body_class: 'club-chat',
					animate: false
				},
				chat_members_list: {
					view_version: 'default',
					body_class: 'chat-members-list',
					animate: false
				}
			};
		});

		window.addEventListener("message", receiveIframeMessage);
		function receiveIframeMessage(event)
		{
			if (event.origin !== "https://www.hentaiheroes.com")
				return;

			if (event.data.msgtype == "chat_init") {
				ClubChat.updateChatVars(event.data);
			}
			else if (event.data.msgtype == "toggleWindow") {
				ClubChat.toggleWindow();
			}
		}
			</script>

		<script type="text/javascript" src="https://www.hentaiheroes.com/js/chat.js?v=62202915"></script>

</head>
<body id="hh_hentai">



<div class="chat-absolute-position" id="resize-chat-box">
	<div class="chat-border-gradient">
		<div class="chat-wrapper">
			<div class="chat-container">

				<a class="close_cross">
					<img src="https://hh2.hh-content.com/design_v2/close_cross_icon.png"/>
				</a>

				<div class="chat_not_in_club" girls_missing>
					<p>You need to acquire more experience to be acknowledged by other heroes.
Continue your journey and find more girls! Come back when you have 15 girls in your Harem!</p>
					<p> <span class="globalClubs_mix_icn"></span> </p>
				</div>

				<div class="chat_not_in_club" not_club_member>
					<p>Create or Join a Club to share your kinky experiences  with other heroes and make it a less lonely adventure!</p>
					<p> <span class="globalClubs_mix_icn"></span> </p>
					<a class="blue_button_L">Go to Clubs</a>
				</div>


				<div class="chat-active-wrapper">
					<h2>Club Chat</h2>

					<div class="chat-tabs">
						<button id="chat_block" class="square_blue_btn" active_btn>
							<span class="chatWhite_flat_icn"></span>
						</button>



						<button id="chat_members_list" class="square_blue_btn">
							<span class="clubMember_flat_icn"></span>
						</button>
					</div>

					<div class="club-chat">

						<div class="club-chat-messages-wrapper">
							<div class="club-chat-messages dark_subpanel_box"></div>
						</div>

						<div class="send-block-container">
							<input class="club-chat-input" maxlength="1000" disabled="">
							<button class="club-chat-send" disabled="">
								<span class="rightArrow_mix_icn"></span>
							</button>
						</div>
					</div>



					<div class="chat-members-list dark_subpanel_box" style="display: none;">
						<div class="online-members"></div>

						<div class="header">
							<h2 class="opacity">Offline</h2>
						</div>
						<div class="offline-members"></div>

						<div class="header muted-header">
							<h2>Muted</h2>
						</div>
						<div class="muted-members"></div>
					</div>

				</div>


			</div>
		</div>
	</div>
</div>



	<iframe width="100%" height="400" id="hh_game" src="/home.html"></iframe>




</body>
</html>
