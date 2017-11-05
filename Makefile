###### BUILD / EXEC ######

all: stop build run
fresh: clean-all all
deploy: stop pull build run
prod: stop configure-prod build-prod run-prod


pull:
	git fetch --all && git reset --hard origin/master && git pull
build:
	sudo docker-compose --project-name ipas build
run:
	sudo docker-compose --project-name ipas up

configure-prod: 
	cd ./frontend && sudo npm install && npm run build && cd - && cp -r ./frontend/build ./proxy
build-prod:
	sudo docker-compose --project-name ipas -f docker-compose-prod.yml build
run-prod:
	sudo docker-compose --project-name ipas -f docker-compose-prod.yml up

####### CLEANUP #########

stop:
	sudo docker-compose --project-name ipas down

clean-all: clean purge

clean:
	sudo docker rm `sudo docker ps --all --quiet` 2> /dev/null || echo "Containers are clean"
purge:
	sudo docker rmi `sudo docker images --all --quiet` 2> /dev/null || echo "Images are clean"

