This is the best [guide](https://docs.aws.amazon.com/eks/latest/userguide/lbc-helm.html) for setting up and getting AWS Load Balancer Controller working with Helm

Install helm [here](https://helm.sh/docs/intro/install/)

Create the role in TF and use this command to find your OIDC provider ID: `aws eks describe-cluster --name <your-eks-cluster-name> --query "cluster.identity.oidc.issuer" --output text`

The ID will be the last variable in the path returned.

You can then use this [URL](https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.11.0/docs/install/iam_policy.json) to get the IAM role policies that we need for helm.

I found that the eksctl to create the service account in the kube-system namespace didn't work and rather created like:
`kubectl create serviceaccount aws-load-balancer-controller -n kube-system` and then added the role to it with the following command `kubectl annotate serviceaccount aws-load-balancer-controller -n kube-system eks.amazonaws.com/role-arn="arn:aws:iam::<account-id>:role/aws-load-balancer-controller" --overwrite`

This is where things get a little tricky - we need to use helm to create the controller in the kube-system namespace using the following command:

```helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=my-eks-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=vpc-<vpc-id> \
  --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=arn:aws:iam::<account-id>:role/aws-load-balancer-controller```

So long as you have enough cpu/memory resources, these policies should be enough to get you working with aws-load-balancer-controller. 