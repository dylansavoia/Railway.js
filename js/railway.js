// First Track
repeat_rail(rails.STRAIGHT, 1, 2);
repeat_rail(rails.STOP, 3, 10);
repeat_rail(rails.STRAIGHT, 11, 13);
repeat_rail(rails.TURN_LEFT, 14, 16);
repeat_rail(rails.TURN_RIGHT, 17, 19);
repeat_rail(rails.STRAIGHT, 20, 22);
create_rail_node(rails.SWITCH_LEFT, 23, 108);
repeat_rail(rails.TURN_LEFT, 24, 25);
repeat_rail(rails.TURN_RIGHT, 26, 27);
create_rail_node(rails.STRAIGHT, 28);
repeat_rail(rails.STOP, 29, 36);
create_rail_node(rails.STRAIGHT, 37);
repeat_rail(rails.TURN_LEFT, 38, 42);
create_rail_node(rails.STRAIGHT, 43);
repeat_rail(rails.STOP, 44, 51);
create_rail_node(rails.STRAIGHT, 52);
repeat_rail(rails.TURN_LEFT, 53, 57);

repeat_rail(rails.STRAIGHT, 58, 59);
repeat_rail(rails.STOP, 60, 67);
repeat_rail(rails.STRAIGHT, 68, 75);
repeat_rail(rails.TURN_LEFT, 76, 78);
repeat_rail(rails.TURN_RIGHT, 79, 81);
repeat_rail(rails.TURN_LEFT, 82, 83);
repeat_rail(rails.TURN_RIGHT, 84, 85);
create_rail_node(rails.STRAIGHT, 86);
repeat_rail(rails.STOP, 87, 94);
create_rail_node(rails.STRAIGHT, 95);
repeat_rail(rails.TURN_LEFT, 96, 100);
repeat_rail(rails.STRAIGHT, 101, 102);
repeat_rail(rails.TURN_LEFT, 103, 107);
create_rail_node(rails.STRAIGHT, 0);

// Second Track
repeat_rail(rails.TURN_LEFT, 109, 112);
create_rail_node(rails.STRAIGHT, 113);
repeat_rail(rails.STOP, 114, 121);
create_rail_node(rails.STRAIGHT, 122);
repeat_rail(rails.TURN_LEFT, 123, 127);
repeat_rail(rails.TURN_RIGHT, 128, 129);
create_rail_node(rails.TURN_LEFT, 130);
create_rail_node(rails.TURN_LEFT,76);



function changeRailway(){
    chgrail.classList.toggle('sel');
	tmp = railway[22].first_child
	railway[22].first_child = railway[22].second_child
	railway[22].second_child = tmp
}
