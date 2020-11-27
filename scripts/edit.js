/* Edit Events */

var viewManagement = viewManagement || {};
viewManagement.edit = {

    currentPlayer: null,

    showFullPlayerList: function () {
        var areaMng = viewManagement.common;
        if (areaMng.isNullOrEmpty(areaMng.dataBase))
            return;

        var players = areaMng.getPlayers();
        if (areaMng.isNullOrEmpty(players))
            return;

        $(window).scrollTop(0);
        $("#card-players").empty();
        $(".options-scroll div").removeClass("active");
        $(".options-scroll #option-full").addClass("active");

        viewManagement.common.sortByProperty(players, "Name").forEach((v, i, a) => {

            var card = $('<div/>', { id: 'card-' + v.Id, class: 'card', style: 'cursor: pointer;', 'data-toggle': "modal", 'data-target': "#playerModal" });
            var cardBody = $('<div/>', { class: 'card-body' });
            var cardText = $('<div/>', { class: 'card-text' });
            var cardTitle = $('<div/>', { id: v.Id, class: 'card-title' });
            var stats = $('<div/>', { class: 'float-right' });

            // Name
            cardTitle.append(
                $('<span/>', { style: 'font-size: 1.25rem; font-weight: 500;', text: v.Name, })
            );

            // Goalkeeper
            if (v.Goalkeeper) {
                cardTitle.append(
                    $('<span/>', { class: 'ml-2 text-muted', title: "Suele jugar de portero" })
                        .append($('<i/>', { class: 'fas fa-mitten' }))
                );
            }

            // Goals
            stats.append(
                $('<span/>', { class: 'mr-2' })
                    .append($('<i/>', { class: 'fas fa-futbol mr-1' }))
                    .append($('<span/>', { text: v.Goals }))
            );

            // Assists
            stats.append(
                $('<span/>', { class: 'mr-2' })
                    .append($('<i/>', { class: 'fas fa-a mr-1' }))
                    .append($('<span/>', { text: v.Assists }))
            );

            // MVPs
            stats.append(
                $('<span/>')
                    .append($('<i/>', { class: 'fas fa-star mr-1' }))
                    .append($('<span/>', { text: v.MVPs }))
            );

            // Matches
            var wins = $('<span/>')
                .append($('<span/>', { text: 'V', class: 'square win' }))
                .append($('<span/>', { text: v.Wins, class: 'square value' }))
            var draws = $('<span/>')
                .append($('<span/>', { text: 'E', class: 'square draw' }))
                .append($('<span/>', { text: v.Draws, class: 'square value' }))
            var defeats = $('<span/>')
                .append($('<span/>', { text: 'D', class: 'square defeat' }))
                .append($('<span/>', { text: v.Defeats, class: 'square value' }))

            cardTitle.append(stats);
            cardText.append(wins);
            cardText.append(draws);
            cardText.append(defeats);
            cardBody.append(cardTitle);
            cardBody.append(cardText);
            card.append(cardBody);

            card.click(() => {
                $("#playerModalTitle").html(v.Id + " - " + v.Name);
                $("#playerName").val(v.Name);
                $("#playerGoalkeeper").prop('checked', v.Goalkeeper);
                $("#playerWins").val(v.Wins);
                $("#playerDraws").val(v.Draws);
                $("#playerDefeats").val(v.Defeats);
                $("#playerGoals").val(v.Goals);
                $("#playerAssists").val(v.Assists);
                $("#playerMVPs").val(v.MVPs);

                viewManagement.edit.currentPlayer = v;
            });

            $("#card-players").append(card);
        });
    },

    savePlayer: function () {
        var areaMng = viewManagement.common;
        let currentPlayer = viewManagement.edit.currentPlayer;

        if (!areaMng.isNullOrEmpty(currentPlayer)) {
            let id = currentPlayer.Id;
            let name = $("#playerName").val();
            let goalkeeper = $("#playerGoalkeeper").prop('checked');
            let wins = $("#playerWins").val();
            let draws = $("#playerDraws").val();
            let defeats = $("#playerDefeats").val();
            let goals = $("#playerGoals").val();
            let assists = $("#playerAssists").val();
            let mvps = $("#playerMVPs").val();

            var players = viewManagement.common.dataBase.Players;
            console.log(JSON.parse(JSON.stringify(players.find(e => e.Id == currentPlayer.Id))));

            players.forEach((v, i, a) => {
                if (v.Id == currentPlayer.Id) {
                    v = {
                        "Id": id,
                        "Name": areaMng.isNullOrEmpty(name) ? currentPlayer.Name : name.trim(),
                        "Goalkeeper": goalkeeper,
                        "Wins": areaMng.isNullOrEmpty(wins) ? 0 : parseInt(wins),
                        "Draws": areaMng.isNullOrEmpty(draws) ? 0 : parseInt(draws),
                        "Defeats": areaMng.isNullOrEmpty(defeats) ? 0 : parseInt(defeats),
                        "Goals": areaMng.isNullOrEmpty(goals) ? 0 : parseInt(goals),
                        "Assists": areaMng.isNullOrEmpty(assists) ? 0 : parseInt(assists),
                        "MVPs": areaMng.isNullOrEmpty(mvps) ? 0 : parseInt(mvps)
                    }
                }
            });

            viewManagement.edit.currentPlayer = null;
        }
    }

};

$(document).ready(function () {
    viewManagement.common.readDataBase(viewManagement.edit.showFullPlayerList);

    $("#btn-SavePlayer").click(() => {
        viewManagement.edit.savePlayer();
        $('#playerModal').modal('hide');
        viewManagement.edit.showFullPlayerList();
    });

    $("#btn-saveFile").click(() => {
        viewManagement.common.saveDataBase();
    });
});
