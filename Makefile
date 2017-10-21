###### BUILD / EXEC ######

all: stop build run
fresh: clean-all all

build:
	sudo docker-compose --project-name compute build
run:
	sudo docker-compose --project-name compute up

####### CLEANUP #########

stop:
	sudo docker-compose --project-name compute down

clean-all: clean purge

clean:
	sudo docker rm `sudo docker ps --all --quiet` 2> /dev/null || echo "Containers are clean"
purge:
	sudo docker rmi `sudo docker images --all --quiet` 2> /dev/null || echo "Images are clean"

