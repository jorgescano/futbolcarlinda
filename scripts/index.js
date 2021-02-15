/* Index Events */

var viewManagement = viewManagement || {};
viewManagement.index = {

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

            var card = $('<div/>', { id: 'card-' + v.Id, class: 'card' });
            var cardBody = $('<div/>', { class: 'card-body' });
            var cardText = $('<div/>', { class: 'card-text' });
            var cardTitle = $('<div/>', { id: v.Id, class: 'card-title pb-1' });
            var stats = $('<div/>', { class: 'float-right pt-1' });

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

            // Penalties saved
            if (!areaMng.isNullOrEmpty(v.PenaltiesSaved)) {
                stats.append(
                    $('<span/>', { class: 'mr-2' })
                        .append($('<i/>', { class: 'fas fa-mitten mr-1' }))
                        .append($('<span/>', { text: v.PenaltiesSaved }))
                );
            }

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
            $("#card-players").append(card);
        });
    },

    showStatPlayerList: function (statName, averageStatName) {
        if (viewManagement.common.isNullOrEmpty(viewManagement.common.dataBase))
            return;

        if (viewManagement.common.dataBase.Players.filter((e) => !viewManagement.common.isNullOrEmpty(e[statName])).length == 0)
            return;

        $(window).scrollTop(0);
        $("#card-players").empty();
        $(".options-scroll div").removeClass("active");
        $(".options-scroll #option-" + statName.toLowerCase()).addClass("active");
        var players = viewManagement.common.getPlayers();
        var sortAverageStatName = viewManagement.common.isNullOrEmpty(averageStatName) ? "Matches" : averageStatName;
        players = viewManagement.common.sortByProperties(players, statName, sortAverageStatName, true, !(sortAverageStatName == "Matches"));
        var positions = 0;
        var prevValue = 0;
        var prevAverageValue = 0;
        players.forEach((v, i, a) => {

            var card = $('<div/>', { id: 'card-' + v.Id, class: 'card' });
            var cardBody = $('<div/>', { class: 'card-body p-0' });
            var divInfo = $('<div/>', { class: 'div-info' });
            var divStat = $('<div/>', { class: 'div-stat', text: v[statName] });
            var cardText = $('<div/>', { class: 'card-text' });
            var cardTitle = $('<div/>', { id: v.Id, class: 'card-title' });

            // console.log(v.Name + " | prevValue " + prevValue + " | prevAverageValue " + prevAverageValue);
            var averageValue = parseFloat(v[sortAverageStatName]);
            if (v[statName] != prevValue) {
                positions += 1;
                prevValue = v[statName];
            } else if (prevAverageValue != averageValue) {
                positions += 1;
            }
            // console.log(v.Name + " | value " + v[statName] + " | averageValue " + parseFloat(v[sortAverageStatName]));
            // console.log("Position "  + positions + "\n\n");
            prevAverageValue = averageValue;

            var podium = null;
            switch (positions) {
                case 1:
                    podium = $('<span/>', { class: 'fas fa-medal mr-2', style: 'font-size: 1.25rem; color: #fbc02d;' });
                    break;
                case 2:
                    podium = $('<span/>', { class: 'fas fa-medal mr-2', style: 'font-size: 1.25rem; color: #9e9e9e;' });
                    break;
                case 3:
                    podium = $('<span/>', { class: 'fas fa-medal mr-2', style: 'font-size: 1.25rem; color: #8d6e63;' });
                    break;
            }
            if (!viewManagement.common.isNullOrEmpty(podium)) {
                cardTitle.append(podium);
            }
            // Name
            cardTitle.append($('<span/>', {
                style: 'font-size: 1.25rem; font-weight: 500;',
                text: v.Name,
            }));
            // Goalkeeper
            if (v.Goalkeeper) {
                cardTitle.append(
                    $('<span/>', { class: 'ml-2 text-muted', title: "Suele jugar de portero" })
                        .append($('<i/>', { class: 'fas fa-mitten' }))
                );
            }
            // Matches
            var info = $('<div/>');
            var played = $('<span/>')
                .append($('<span/>', { text: 'PJ', class: 'square stat' }))
                .append($('<span/>', { text: v.Matches, class: 'square stat-value' }));
            info.append(played);
            if (!viewManagement.common.isNullOrEmpty(v[averageStatName])) {
                var averageStat = $('<span/>', { class: 'square stat' });
                if (statName == "Goals") averageStat.append($('<i/>', { class: 'fas fa-futbol', style: 'font-size: 0.9rem;' }));
                else if (statName == "Assists") averageStat.append($('<span/>', { text: 'A' }));
                averageStat.append($('<span/>', { text: '/P' }));
                var average = $('<span/>')
                    .append(averageStat)
                    .append($('<span/>', { text: v[averageStatName], class: 'square stat-value' }));
                info.append(average);
            }

            cardText.append(info);
            divInfo.append(cardTitle);
            divInfo.append(cardText);
            cardBody.append(divInfo);
            cardBody.append(divStat);
            card.append(cardBody);
            $("#card-players").append(card);
        });
    }

};

$(document).ready(function () {
    $(".options-scroll #option-full").click(() => { viewManagement.index.showFullPlayerList() });
    $(".options-scroll #option-goals").click(() => { viewManagement.index.showStatPlayerList("Goals", "GoalsAverage") });
    $(".options-scroll #option-assists").click(() => { viewManagement.index.showStatPlayerList("Assists", "AssistsAverage") });
    $(".options-scroll #option-mvps").click(() => { viewManagement.index.showStatPlayerList("MVPs") });
    $(".options-scroll #option-wins").click(() => { viewManagement.index.showStatPlayerList("Wins") });
    $(".options-scroll #option-defeats").click(() => { viewManagement.index.showStatPlayerList("Defeats") });

    viewManagement.common.readDataBase(viewManagement.index.showFullPlayerList);
});
