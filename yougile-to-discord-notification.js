// On update event
Chat.onPostMessage = function (message) {
    let object = Current.chat

    // Get task info
    let taskName = object.name;

    // Get users info
    let assignedUsers = Users.getAssigned(Items.get(object.id), true);

    // Compose assignee lists
    let assigned = "";
    assignedUsers.forEach(function (elem, index) {
        assigned += elem.name;
        if((index + 1) != (assignedUsers.length)){
            assigned += ", ";
        }
    });

    if (message.text.length > 1 && message.text === "!!!") {
        let message = "Добавилось вложение в задачу **" + taskName + "** (" + assigned + ")";
        PostMessage(object, "Новое вложение для ", message);
    }

};
// On move event
Items.onMove = function (object, from, to) {
    // Check we work with tasks only
    if (object.type !== 'Task') {
        return true;
    }

    // Check task really moved
    if (from === to) {
        return true;
    }

    // Get task info
    let taskName = object.name;
    let oldColumnName = from.name
    let newColumnName = to.name;

    // Get users info
    let assignedUsers = Users.getAssigned(Items.get(object.id), true);
    
    // Compose assignee lists
    let assigned = "";
    assignedUsers.forEach(function (elem, index) {
        assigned += elem.name;
        if((index + 1) != (assignedUsers.length)){
            assigned += ", ";
        }
    });

    // Compose final message
    let message = "Задача **" + taskName + "** изменилась с *" + oldColumnName + "* на ***" + newColumnName + "*** (" + assigned + ")";

    PostMessage(object, "Смена статуса у ", message);

};

function PostMessage(object, titlePrefix, message) {
    // Send message
    const webhookURL = '<Discord Webhook URL>';
    
    const companySubID = Current.company.id.substr(Current.company.id.lastIndexOf('-')+1);
    const taskSubID = object.id.substr(object.id.lastIndexOf('-')+1);
    const payload = JSON.stringify({
      username: "YouGile Notification",
      avatar_url: "https://i.pravatar.cc/300",
      embeds: [{
        color: 0x0db816,
        title: titlePrefix + object.name,
        description: message,
        url: "https://yougile.com/team/" + companySubID + "/" + Current.project.name + "/#chat:" + taskSubID,
        footer: {
            text: "Powered by YouGile"
        },
        author: {
            name: Current.user.name
        },
    }]});

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: payload
    });
}