/* Matches Events */

var viewManagement = viewManagement || {};
viewManagement.matches = {

    showMatchesList: function () {
        if (viewManagement.common.isNullOrEmpty(viewManagement.common.dataBase))
            return;

        $("#card-matches").empty();
        var matches = viewManagement.common.getMatches();
        viewManagement.common.sortByProperties(matches, "Date", "Id", true, true).forEach((v, i, a) => {

            var card = $('<div/>', { id: 'card-' + v.Id, class: 'card' });
            var cardBody = $('<div/>', { class: 'card-body text-center' });
            
            if (v.Text != null) {
                cardBody.addClass("card-body-nomatch");
                var cardText = $('<span/>', { class: "text-shadow", text: v.Text });
                cardBody.append(cardText);
            } else {
                var cardTitle = $('<div/>', { id: 'card-title-' + v.Id, class: 'match-title' });

                cardTitle.append($('<div/>', { class: 'h6', text: viewManagement.common.dateToString(v.Date) }));

                var score = $('<div/>', { class: 'h4' });
                score.append(
                    $('<span/>')
                        .append($('<i/>', { class: 'fas fa-tshirt mr-3 ' + v.Local }))
                        .append($('<span/>', { text: v.LocalScore }))
                );
                score.append($('<span/>', { class: 'mx-2', text: '-' }));
                score.append(
                    $('<span/>')
                        .append($('<span/>', { text: v.AwayScore }))
                        .append($('<i/>', { class: 'fas fa-tshirt ml-3 ' + v.Away }))
                );
                cardTitle.append(score);
                var chevronDiv = $('<div/>');
                var chevron = $('<i/>', { class: 'fas fa-chevron-down' });
                chevronDiv.append(chevron);
                cardTitle.append(chevronDiv);

                var info = $('<div/>', { id: 'card-info-' + v.Id, style: 'display: none;' });

                var localPlayers = $('<div/>', { class: 'team-info my-2' });
                v.LocalPlayers.forEach((player, i, a) => {
                    var div = viewManagement.matches.createMatchPlayerDiv(player, v.MVP, v.Away, v.LocalPlayers[i + 1] == null);
                    localPlayers.append(div);
                });

                var awayPlayers = $('<div/>', { class: 'team-info' });
                v.AwayPlayers.forEach((player, i, a) => {
                    var div = viewManagement.matches.createMatchPlayerDiv(player, v.MVP, v.Local, v.AwayPlayers[i + 1] == null);
                    awayPlayers.append(div);
                });

                info.append(localPlayers);
                info.append(awayPlayers);
                cardBody.append(cardTitle);
                cardBody.append(info);

                cardTitle.click(() => {
                    info.slideToggle();
                    if (chevron.hasClass('fa-chevron-down')) {
                        chevron.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    } else {
                        chevron.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    }
                });
            }

            card.append(cardBody);
            $("#card-matches").append(card);
        });
    },

    createMatchPlayerDiv: function (player, mvp, swapTeam, last) {
        var div = $('<div/>', { class: last ? '' : 'mb-3' });
        div.append($('<span/>', { class: 'player-name', text: player.Name || player.Text }));

        if (player.Id != null) {
            if (player.Id == mvp) {
                div.append(
                    $('<span/>', { class: 'ml-2', style: 'color:#fdd835' })
                        .append($('<i/>', { class: 'fas fa-star', title: 'MVP' }))
                );
            }

            if (player.Goalkeeper) {
                div.append(
                    $('<span/>', { class: 'ml-2 text-muted' })
                        .append($('<i/>', { class: 'fas fa-mitten', title: 'Portero' }))
                );
            }

            if (player.Swap) {
                div.append(
                    $('<span/>', { class: 'ml-2 ' + swapTeam, style: "filter: saturate(0.5);" })
                        .append($('<i/>', { class: 'fas fa-exchange', title: 'Cambio de equipo' }))
                );
            }

            if (player.Assists != 0) {
                div.append(
                    $('<span/>', { class: 'float-right' })
                        .append($('<span/>', { class: 'square stat', text: 'A' }))
                        .append($('<span/>', { text: player.Assists, class: 'square stat-value' }))
                );
            }

            if (player.Goals != 0) {
                div.append(
                    $('<span/>', { class: 'float-right' })
                        .append($('<span/>', { class: 'square stat' }).append($('<i/>', { class: 'fas fa-futbol', style: 'font-size: 0.9rem;' })))
                        .append($('<span/>', { text: player.Goals, class: 'square stat-value' }))
                );
            }

            if (!viewManagement.common.isNullOrEmpty(player.PenaltiesSaved) && player.PenaltiesSaved != 0) {
                div.append(
                    $('<span/>', { class: 'float-right' })
                        .append($('<span/>', { class: 'square stat' }).append($('<i/>', { class: 'fas fa-mitten', style: 'font-size: 0.9rem;' })))
                        .append($('<span/>', { text: player.PenaltiesSaved, class: 'square stat-value' }))
                );
            }
        } else if (player.Text != null) {
            div.addClass("extra-player-div");
        }

        return div;
    }

};

$(document).ready(function () {
    viewManagement.common.readDataBase(viewManagement.matches.showMatchesList);
});
