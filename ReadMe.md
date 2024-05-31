# General rules:
1. Use any language of your choice - **Node js is used for creating web API. It can be seen in index.js**
2. K8s cluster can be deployed anywhere you like - **GCP is used for K8s cluster and Doccker hub for storing docker images**
3. Direct Pod IPs should not be used for communication. Use k8s services
for communication - **Using K8s services via deploying yaml for stateful set DB using db-service.yaml and for rest API using api-service-loadbalancer.yaml. Using external endpoint for loadbalancer to communicate with outside world**
4. Any config values should be passed using K8s ConfigMaps - **Config for stateful set DB are define in db-configmap.yaml and for rest API are define in api-service-configmap.yaml**
5. Any secret info like password etc should be passed using K8s secrets. **Secrets for stateful set DB are define in db-secret.yaml and for rest API are define in api-service-secret.yaml**

# Deliverables
1. Make sure it includes all Kubernetes YAML files used in the assignment - **All yaml files are attached**
2. Dockerfile should be present as well - **Docker file is present**
3. Current docker image deployed on Kubernetes api-service: **tbansal18101991docker/index_image_v17**
4. Also include a README.md file - **ReadMe.md is present. ReadMe also describe steps followed while creating the cluster, stateful set DB, k8s configmap, k8s secret, loadbalancer, deployment, docker build, pushing of docker image, enabling HPA and rolling update for api-service**
5. Link for the code repository - **https://github.com/tanujbansal/Docker_Kubernetes_Nagp_2024_Assignment**
6. Docker hub URL for docker images - **https://hub.docker.com/repositories/tbansal18101991docker**
7. URL for Service API tier to view the records from backend tier 
   -> Url for fetching all employee details(GET REST API): **http://35.222.173.1:80/getAllEmployees**
   -> Url for adding employee detail(POST REST API): **http://35.222.173.1:80/addEmployee**
      sample body for POST api: 
      {
    "name":"TB-1",
    "email": "tb-1@gmail.com",
    "designation": "Associate",
    "department": "HR" 
      }
   -> Url for deleting all records: **http://35.222.173.1:80/deleteAllEmployees**
8. Link for screen recording video showing everything mentioned above - **https://nagarro-my.sharepoint.com/:f:/p/tanuj_bansal/EjtMswy_241KiZzo9-uKWxcBjD_fQo3LufxKOimMtgFOZA?e=gALHSL**

# Steps to install Gcloud cli and Kubectl
1. On Mac, I have downloaded x86 tar for Gcloud Cli from URL : **https://cloud.google.com/sdk/docs/install**
2. Installed kubectl components using command : **gcloud components install kubectl**


# Steps to follow for creating kubernetes cluster, postgres DB using statefulset and service
1. Logged into GCP and created a project named 'Tanuj-kubernetes-nagp-2024'.
2. Enable 'kubernetes engine API' for the project.
1. Connected my system terminal with GCP cloud using command : **gcloud auth login**
2. Set my GCP project ID using command : **gcloud config set project lithe-realm-424814-f1**
3. Created GKE cluster having name 'tanuj-kubernetes-nagp-2024' with node 2 in us-central-a zone(By default autopilot mode) : **gcloud container clusters create tb-kubernetes-nagp-2024 --num-nodes=2 --zone=us-central1-a**
4. Created namespace having name 'tb-k8-nagp-2024' inside the cluster using command : **kubectl create namespace tb-k8-nagp-2024**
5. Created yaml file with kind 'ConfigMap', apiVersion 'v1' and used same namespace created before. In my case, I have created **db-configmap.yaml** with namespace 'tb-k8-nagp-2024'.
6. Navigated to path in my terminal where configmap yaml file was kept.
7. Apply changes for confimap yaml using command : **kubectl apply -f db-configmap.yaml**
8. Now created yaml file with kind 'Secret', apiVersion 'v1' and used same namespace created before. In my case, I have created **db-secret.yaml** with namespace 'tb-k8-nagp-2024'. For updating same 'apply' command can be used.
9. Apply changes for secret yaml using command : **kubectl apply -f db-secret.yaml**. ConfigMap and Secret yaml can be seen and verified under GCP project section called 'Secrets & ConfigMaps'. In my case, db-configmap and db-secret files have been created. It can seen in screenshot or recordings.
10. Created disk space with name 'tb-disk-k8-nagp' in the cluster of size 10GB and in the working zone using command : **gcloud compute disks create <namespace> --zone=us-central1-a --size=10GB** 
11. Created yaml file with kind 'PersistentVolume', apiVersion 'v1' and used same namespace created before. In my case, I have created **db-persistent-volume.yaml** with namespace 'tb-k8-nagp' and size 10Gi. Apply changes for db-persistent-volume yaml using command : **kubectl apply -f db-persistent-volume.yaml**
12. Created yaml file with kind 'PersistentVolumeClaim', apiVersion 'v1' and used same namespace created before. In my case, I have created **db-persistent-volume-claim.yaml** with namespace 'tb-k8-nagp' and size 10Gi. Apply changes for db-persistent-volume-claim yaml using command : **kubectl apply -f db-persistent-volume-claim.yaml**
13. Verified the status for persistent volume and persistent volume claim using commands: **kubectl get pv -n <namespace>** and **kubectl get pvc -n <namespace>** respectively. The status of pvc should show as 'Bound'.
14. Created yaml of kind 'StatefulSet' and apiVersion 'apps/v1' and used same namespace created before. In my case, I have created **db-stateful-set.yaml**. Apply changes for db-stateful-set yaml using command : **kubectl apply -f db-stateful-set.yaml**
15. Verified tthe stateful set DB creation using command : **kubectl get pod -n <namespace>**. It displayed name of statefulset as 'db-statefulset-0', status as 'Running' and Ready as '1/1'.
16. Created yaml of kind 'Service' and apiVersion 'v1' and used same namespace created before. In my case, I have created **db-service.yaml**. For headless service, keep clusterIP as 'None'. Apply changes for db-service yaml using command : **kubectl apply -f db-service.yaml**. For verifying status, used command : 
**kubectl get service -n <namespace>**.


# Steps been followed for building Docker image and pushing it on docker hub
1. Downloaded DockerHub Desktop for Mac and login with my credentials.
2. Created a folder named 'nodejs-server' which contains files related to code for api services.
3. Created a Dockerfile defining the instructions for building the docker image.
4. Created index.js file defining the GET and POST request interface for communicating with postgres DB created in kubernetes with statefulset. Use listening port **SERVICE_PORT** which is not been allocated before. Use DB config and secret parameters defined in api-service-configmap.yaml and api-service-secret.yaml.
5. To test locally if index.js file compile and works fine, following command can be used : **node index.js**. Run the application on **localhost:SERVICE_PORT**
6. To test locally with Docker, if index.js file compile and works with docker, following commands are used:
   -> Login into docker hub using command: **docker login**
   -> For building docker image: **docker build -t <image_name> <path_for_docker_file>**
   -> For listing all docker images, used command : **docker images**
   -> For running a particular docker image, used command: **docker run -p SERVICE_PORT:SERVICE_PORT <image_name>:latest** 
   -> Verified status by opening application in browser: **localhoost:SERVICE_PORT**
7. To push docker image to docker hub registry
   -> Tag docker image using command : **docker tag <image_name>:latest <docker_hub_username>/<image_name>:latest**
   ->  Now pushed docker image to docker hub using command:  **docker push <docker_hub_username>/<image_name>:latest**. Keep images access as public so it can be acccessed from outside. This image will be referenced in deployment yaml.

# Steps been followed for creating kubernetes API service for deployment, load balancer(headless service) and connecting with DB
1. Created a folder named '**k8s-API-service**' and navigate to this path in terminal.
2. Created yaml of kind 'ConfigMap' named **api-service-configmap.yaml** for API service configurations. Use same namespace which was used for statefulset DB. Applied changes using command:  **kubectl apply -f api-service-configmap.yaml**
3. Created yaml of kind 'Secret' named **api-service-secret.yaml** for API service secrets. Use same namespace which was used for statefulset DB. Applied changes using command:  **kubectl apply -f api-service-secret.yaml**
4. Created yaml of kind 'Deployment' named **api-service-deployment.yaml** for API service deployment. Use same namespace which was used for statefulset DB. Pull image from Docker hub using syntax: **index.docker.io/<docker_hub_username>/<image_name>:latest** .Applied changes using command:  **kubectl apply -f api-service-deployment.yaml**
5. Created yaml of kind 'Service' named **api-service-loadbalancer.yaml** for loadbalancer service. Use same namespace which was used for statefulset DB. Applied changes using command:  **kubectl apply -f api-service-loadbalancer.yaml**
6. Once loadbalancer is running then it's external endpoint can be used to access it from outside the cluster.


# Steps been followed for applying rolling update of api-service-deployment pods
1. Create a new docker image, tag the image and push it to docker hub using commands already mentioned above. Once we have docker image push into docker hub then we are ready to rollout update.
2. Set docker image to deployment pod using command: **kubectl set image deployments/<deployment_pod_name> <deployment_ccontainer_name>=index.docker.io/<docker_hub_username>/<image_name>:latest -n <namespace>**
3. Verified the rollout status using command: **kubectl rollout status deployments/<deployment_pod_name> -n <namespace>**
4. Check pods description and updatted image name using ccommand: **kubectl describe pods <deployment_pod_name> -n <namespace>**


# Steps been followed for enabling Horizontal autoscaler for API service deployed
1. Get the running pods using command: **kubectl get pods -n <namespace>**
2. Enabled the Horizontal auto scaling for **api-service-deployment** pod by specifying the threshold parameters like cpu usage, minimum pods and maximum pods using command: **kubectl autoscale deployment <deployment_pod_name> -n <namespace> --cpu-percent=3 --min=3 --max=5**.It can also be configured or moddified from GCP portal.
3. Get all pods which have enabled with HPA in specified namespace using command: **kubectl get hpa -n <namespace>**
4. To show the detailed description for a particular pod enabled with HPA with command: **kubectl describe hpa <deployment_pod_name> -n <namespace>**
5. For displaying metrices, use following commands:
   -> For getting metrice for top nodes: **kubectl top nodes**
   -> For getting metrice for top pods: **kubectl top pods -n <namespace>**
