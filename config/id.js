<div id="paytm-checkoutjs">
    <section class="chat__section">
    <div class="message__area">
        <div class="incoming message">
            <h4>Medicare</h4>
            <p id="username">Hope you are well <%=locals.user.name%></p>
        </div>
        <div class="incoming message">
            <h4>Medicare</h4>
            <p id="output">Please check your details : </p>
            <p> Height - <%= details['height']%> foot</p>
            <p>Weight - <%= details['weight']%> Kg</p>
            <p>Age - <%= details['age']%> years</p>
        </div>
        <div class="incoming message">
            <h4>Medicare</h4>
            <p id="username">If above details are blank/incorrect then please type "Update" otherwise type "Continue"</p>
        </div>
    </div>
    <div id="text" >
        <textarea id="textarea" cols="30" rows="1" placeholder="Write a message..."></textarea>
    </div>
    </section>

</div>
<script src="/socket.io/socket.io.js"></script>
<script src="/js/chatBot.js"></script>
