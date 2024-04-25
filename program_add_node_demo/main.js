document.addEventListener("DOMContentLoaded", function() {
    var rightcard = false;
    var tempblock;
    var tempblock2;


    // LEFT_BAR 和 NODE_CONFIG是内置的
    let LEFT_BAR = {
        station: ['station_standard'],
        pipeline: ['pipeline_standard'],
        analyze: ['analyze_standard']
    }
    
    let NODE_CONFIG = {
        analyze_standard: {
            index: 0,
            img: "/static/imgs/flowy/actionblue.svg",
            title: "xxx",
            desc: "xxx",
            category: "analyze",
            html: ''
        },
        pipeline_standard: {
            index: 0,
            img: "/static/imgs/flowy/actionblue.svg",
            title: "xx",
            desc: "xx",
            category: "pipeline",
            html: ''
        },
        station_standard: {
            index: 0,
            img: "/static/imgs/flowy/eye.svg",
            title: "x",
            desc: "x",
            category: "station",
            html: ''
        }
    }

    // 根据csv解析
    let NODE_RELATIONSHIP = {
        "gongwei_1": {
            "name": "gongwei_1",
            "parent_id": -1,
            "type": "station",
            "pipeline": [
                {
                    "name": "pipeline_1",
                    "parent_id": 0,
                    "type": "pipeline"
                },
                {
                    "name": "pipeline_2",
                    "parent_id": 0,
                    "type": "pipeline"
                }
            ],
            "analyze": [
                {
                    "name": "analyze_1",
                    "parent_id": 1,
                    "type": "analyze"
                },
                {
                    "name": "analyze_2",
                    "parent_id": 1,
                    "type": "analyze"
                },
                {
                    "name": "analyze_2",
                    "parent_id": 2,
                    "type": "analyze"
                },
                {
                    "name": "analyze_3",
                    "parent_id": 2,
                    "type": "analyze"
                }
            ]
        },
        "gongwei_2": {
            "name": "gongwei_2",
            "parent_id": -1,
            "type": "station",
            "pipeline": [
                {
                    "name": "pipeline_2",
                    "parent_id": 0,
                    "type": "pipeline"
                }
            ],
            "analyze": []
        }
    }



    for (let node in NODE_CONFIG) {
        NODE_CONFIG[node]['html'] += `
        <div class="blockelem create-flowy noselect">
            <input type="hidden" name='blockelemtype' class="blockelemtype" value="${node}">
            <div class="grabme">
                <img src="/static/imgs/flowy/grabme.svg">
            </div>
            <div class="blockin">
                <div class="blockico">
                    <span></span>
                    <img src="${NODE_CONFIG[node].img}">
                </div>
                <div class="blocktext">
                    <p class="blocktitle">${NODE_CONFIG[node].title}</p>
                    <p class="blockdesc">${NODE_CONFIG[node].desc}</p>
                </div>
            </div>
        </div>
        `
    }

    let block_html = ''
    for (let node of LEFT_BAR['station']) {
        block_html += NODE_CONFIG[node]['html']
    }

    document.getElementById("blocklist").innerHTML = block_html;

    $(`[id^="station_"]`).on('click', function() {
        flowy.deleteBlocks()
        let a = flowy.blocks()
        $('#blocklist').hide()

        console.log(this.getAttribute('id'))
        gen_station_flow(this.getAttribute('id').replace('station_',''))
           

    });

    function onRearrange(block, parent) {
        // When a block is rearranged
        return true;
    }
    flowy(document.getElementById("canvas"), drag_func, release, snapping, onRearrange);

    function addEventListenerMulti(type, listener, capture, selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(type, listener, capture);
        }
    }


    function snapping(drag, first) {
        // var grab = drag.querySelector(".grabme");
        // grab.parentNode.removeChild(grab);
        // var blockin = drag.querySelector(".blockin");
        // blockin.parentNode.removeChild(blockin);

        // node_cfg = NODE_CONFIG[drag.querySelector(".blockelemtype").value]
        // console.log(node_cfg, drag.querySelector(".blockelemtype").value)
        // drag.innerHTML += `<div class='blockyleft'><img src='/static/imgs/flowy/eyeblue.svg'><p class='blockyname'>${node_cfg.title}</p></div><div class='blockyright'><img src='${node_cfg.img}'></div><div class='blockydiv'></div><div class='blockyinfo'>${node_cfg.desc}</div>`;
        return true;
    }

    function drag_func(block) {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }

    function release() {
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }
    var disabledClick = function() {
        document.querySelector(".navactive").classList.add("navdisabled");
        document.querySelector(".navactive").classList.remove("navactive");
        this.classList.add("navactive");
        this.classList.remove("navdisabled");
        let id = this.getAttribute("id")
        if (id == 'root') {
            $('#all_stations').show()
            $('#blocklist').hide()


        } else {
            $('#all_stations').hide()
            $('#blocklist').show()
            let block_html = ''
            for (let node of LEFT_BAR[id]) {
                block_html += NODE_CONFIG[node]['html']

            }
            document.getElementById("blocklist").innerHTML = block_html;

        }


    }
    addEventListenerMulti("click", disabledClick, false, ".side");
    document.getElementById("close").addEventListener("click", function() {
        if (rightcard) {
            rightcard = false;
            document.getElementById("properties").classList.remove("expanded");
            setTimeout(function() {
                document.getElementById("propwrap").classList.remove("itson");
            }, 300);
            tempblock.classList.remove("selectedblock");
        }
    });

    document.getElementById("removeblock").addEventListener("click", function() {
        flowy.deleteBlocks();
    });
    var aclick = false;
    var noinfo = false;
    var beginTouch = function(event) {
        aclick = true;
        noinfo = false;
        if (event.target.closest(".create-flowy")) {
            noinfo = true;
        }
    }
    var checkTouch = function(event) {
        aclick = false;
    }
    var doneTouch = function(event) {
        if (event.type === "mouseup" && aclick && !noinfo) {
            if (!rightcard && event.target.closest(".block") && !event.target.closest(".block").classList.contains("dragging")) {
                tempblock = event.target.closest(".block");
                rightcard = true;
                document.getElementById("properties").classList.add("expanded");
                document.getElementById("propwrap").classList.add("itson");
                tempblock.classList.add("selectedblock");
            }
        }
    }
    addEventListener("mousedown", beginTouch, false);
    addEventListener("mousemove", checkTouch, false);
    addEventListener("mouseup", doneTouch, false);
    addEventListenerMulti("touchstart", beginTouch, false, ".block");


    function add_node(node_type, node_name, parent_node_id) {
        console.log(node_name, parent_node_id)
        offset_y = 100
        offset_x = 200

        $(`#${node_type}`).click()

        let evt = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        console.log($(`input[value="${node_type}_standard"]`).parent()[0])

        $(`input[value="${node_type}_standard"]`).parent()[0].dispatchEvent(evt);

        console.log('flowy', $(flowy.drag()).find('blocktitle'))
        $(flowy.drag()).find('.blocktitle').html(node_name)

        if (parent_node_id == -1) {
            flowy.drag().style.left = '900px'
            flowy.drag().style.top = '150px'
        } else {
            let newleft = flowy.blocks()[parent_node_id].x + offset_x + "px"
            let newtop = flowy.blocks()[parent_node_id].y + offset_y + "px"

            flowy.drag().style.left = newleft
            flowy.drag().style.top = newtop
            console.log(newleft, newtop, flowy.drag())
        }

        let evt1 = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        $('#canvas')[0].dispatchEvent(evt1);
    }

    function gen_station_flow(station_name) {

        let station_dict = NODE_RELATIONSHIP[station_name]
        add_node(station_dict['type'], station_dict['name'], -1)
        if (station_dict['pipeline'].length > 0){
            for (let level_1 of station_dict['pipeline']) {
                add_node(level_1['type'], level_1['name'], level_1['parent_id'])
            }
        }
        if (station_dict['analyze'].length > 0){
            for (let level_2 of station_dict['analyze']) {
                add_node(level_2['type'], level_2['name'], level_2['parent_id'])
            }
        }

        // 最后回到首页
        $(`#station`).click()

    }
    $(document).ready(function() {
        flowy.deleteBlocks()
        gen_station_flow("gongwei_1")

    })


    console.log(flowy.blocks)


});