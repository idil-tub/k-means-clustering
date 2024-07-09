var documenterSearchIndex = {"docs":
[{"location":"getting_started/#Two-Dimensions-(Sepal-Length-and-Width)-Example-of-Iris-Data","page":"Getting Started","title":"Two Dimensions (Sepal Length and Width) Example of Iris Data","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"This is a simple example with real world data on how to use KMeans Clustering and visualize the clusters.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"The process consists of four main steps:","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"Data Loading - Iris Data\nData Preprocessing - Extract required data and convert to required data format\nKMeans Clustering Execution - KMean and KMean++\nResults Visualization - 2D Plot","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"using KMeansClustering\nusing MLJ\nusing DataFrames\nusing Plots\nENV[\"GKSwstype\"] = \"100\" # hide\ngr() # hide\n\n# Load Iris data\nmodels() \ndata = load_iris()\niris = DataFrame(data)\ny_iris, X_iris = unpack(iris, ==(:target); rng=123);\n\n# Extract sepal_length and sepal_width features from Iris dataset\n# Convert selected features to a vector for KMeans clustering\nX_iris = Matrix(X_iris[:, 1:2])'\nX_iris_vec = [Vector{Float64}(col) for col in eachcol(X_iris)]\n\n# Execute KMeans clustering\nk = 3\nmax_iter = 100\ntol = 0.0001\nInitializer = KMeansPPInit{Vector{Float64}}()\nclusters = KMeans(X_iris_vec, k; init = Initializer, max_iter = max_iter, tol = tol)\nclusters # hide","category":"page"},{"location":"getting_started/#Visualization","page":"Getting Started","title":"Visualization","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"# Plot the result\np = plot(title=\"Two Dimension KMean - Iris\", xlabel=\"sepal_length\", ylabel=\"sepal_width\", legend=:topright)\ncolor_palette = palette(:tab10)\n\nfor (i, (centers, members)) in enumerate(clusters)\n\n    mem_x = [members[i][1] for i in 1:length(members)]\n    mem_y = [members[i][2] for i in 1:length(members)]\n    \n    # Plot cluster points\n    scatter!(p, mem_x, mem_y, label=\"Cluster $i\", color=color_palette[i])\n    \n    # Plot cluster center\n    scatter!(p, [centers[1]], [centers[2]], color=color_palette[i], marker=:star, markersize=10, label=\"Center $i\")\n\nend\nsavefig(p, \"two_dim_kmeans_iris.svg\"); nothing # hide","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"getting_started/#High-Dimensions-Example-of-Wine-Data","page":"Getting Started","title":"High Dimensions Example of Wine Data","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"This example illustrates the application of KMeans Clustering to high-dimensional, real-world data, demonstrating how the algorithm partitions and visualizes complex datasets into distinct clusters.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"The process consists of four main steps:","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"Data Loading - Wine Data\nData Preprocessing - Normalize and convert to required data format\nKMeans Clustering Execution - KMean and KMean++\nResults Visualization - t-SNE to 2D Plot","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"using KMeansClustering\nusing TSne\nusing HTTP\nusing CSV\nusing DataFrames\nusing MLJ\nusing Plots\nENV[\"GKSwstype\"] = \"100\" # hide\ngr() # hide\n\n# Load wine data\n# There are 13 features: Alcohol,Malic.acid,Ash,Acl,Mg,Phenols,Flavanoids,Nonflavanoid.phenols,Proanth,Color.int,Hue,OD,Proline\ndata_path = \".\\\\wine.csv\"\nurl = \"https://gist.githubusercontent.com/tijptjik/9408623/raw/b237fa5848349a14a14e5d4107dc7897c21951f5/wine.csv\"\nHTTP.download(url, data_path)\n\nwine_df = CSV.read(data_path, DataFrame)\ny_wine, X_wine = unpack(wine_df, ==(:Wine); rng=123);\n\nX_wine = Matrix(X_wine)'\n\n# Normalize\nX_normalized = (X_wine .- mean(X_wine, dims=1)) ./ std(X_wine, dims=1)\n\n# Convert to vector\nX_normalized_vec = [Vector{Float64}(col) for col in eachcol(X_normalized)]\n\n# Execute KMeans clustering\nk = 3\nmax_iter = 100\ntol = 0.0001\nInitializer = KMeansPPInit{Vector{Float64}}()\nclusters = KMeans(X_normalized_vec, k; init = Initializer, max_iter = max_iter, tol = tol)\nclusters # hide","category":"page"},{"location":"getting_started/#Visualization-2","page":"Getting Started","title":"Visualization","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"We use t-SNE to do dimension reduction for visulization. ","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"t-SNE (t-Distributed Stochastic Neighbor Embedding) is a powerful dimensionality reduction and data visualization technique used in machine learning and data science.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"# Extract and combine centers and clusters for the purpose of using t-SNE\ncombined_centers_clusters = Matrix{Float64}(undef, 0, length(first(first(clusters)[2])))\ncenters_index = Int[]\nglobal count_index = 1\nfor (i, (centers, members)) in enumerate(clusters)\n    global combined_centers_clusters = vcat(combined_centers_clusters, centers')\n    push!(centers_index, count_index)\n    \n    for member in members\n        global combined_centers_clusters = vcat(combined_centers_clusters, member')\n        global count_index += 1\n    end\n    \n    global count_index += 1\nend\n\n# Execute t-SNE\ntsne_result = tsne(combined_centers_clusters, 2, 50, 1000, 20.0);\n\n# Convert to vector\ntsne_result_vec = [Vector{Float64}(col) for col in eachcol(tsne_result')]\n\n# Plot the result\np = plot(title=\"High Dimension KMean - Wine\", xlabel=\"t-SNE 1\", ylabel=\"t-SNE 2\", legend=:topright)\ncolor_palette = palette(:tab10)\n\nfor i in 1:k\n    tsne_result_members = []\n     \n    for j in (centers_index[i]+1):(i != k ? (centers_index[i+1]-1) : length(tsne_result_vec) )\n        push!(tsne_result_members, tsne_result_vec[j])\n    end\n\n    # Plot cluster points\n    mem_x = [tsne_result_members[m][1] for m in 1:length(tsne_result_members)]\n    mem_y = [tsne_result_members[m][2] for m in 1:length(tsne_result_members)]\n\n    scatter!(p, mem_x, mem_y, color=color_palette[i] , label=\"Cluster $i\")\n    \n    # Plot cluster center\n    scatter!(p, ([tsne_result_vec[centers_index[i]]][1][1], [tsne_result_vec[centers_index[i]]][1][2]), color=color_palette[i], marker=:star, markersize=10, label=\"Center $i\")\nend\n\nsavefig(p, \"high_dim_kmeans_wine.svg\"); nothing # hide","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"installation/#Installation","page":"Installation","title":"Installation","text":"","category":"section"},{"location":"installation/","page":"Installation","title":"Installation","text":"You can install KMeansClustering.jl by adding it directly from our GitHub repository. Here are the steps:","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"Open Julia's REPL (the Julia command-line interface).\nPress ] to enter Pkg mode (the prompt should change to pkg>).\nRun the following command to add KMeansClustering.jl:","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"pkg> add https://github.com/idil-tub/KMeansClustering.jl.git","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"Once installed, you can import the package and start using it.","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"using KMeansClustering","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = KMeansClustering","category":"page"},{"location":"#KMeansClustering","page":"Home","title":"KMeansClustering","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for KMeansClustering.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [KMeansClustering, KMeansClustering.Init, KMeansClustering.KMeansAlgorithms, KMeansClustering.Norm, KMeansClustering.Centroid, KMeansClustering.Types]","category":"page"},{"location":"#KMeansClustering.KMeans-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeans","text":"KMeans(x::AbstractVector{V}, k::Int64; init::ClusterInit{V}=UniformRandomInit{V}(), max_iter::Int64=300, tol::Float64=0.0001, algorithm::KMeansAlgorithm=Lloyd{V}(), centroid::CentroidCalculator{V}=EuclideanMeanCentroid{V}(), normSqr::NormSqr{V}=EuclideanNormSqr{V}())::AbstractVector{Pair{V, AbstractVector{V}}} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nPerform K-means clustering on the data x with k clusters.\n\nThis function provides a flexible interface to various K-means clustering implementations, allowing customization of initialization, algorithm, centroid calculation, and distance metric.\n\nArguments\n\nx::AbstractVector{V}: Input data as an abstract vector of type V.\nk::Int64: Number of clusters to form.\n\nKeyword Arguments\n\ninit::ClusterInit{V}=UniformRandomInit{V}(): Cluster initialization method.\nmax_iter::Int64=300: Maximum number of iterations.\ntol::Float64=0.0001: Tolerance for convergence.\nalgorithm::KMeansAlgorithm=Lloyd{V}(): K-means algorithm variant to use.\ncentroid::CentroidCalculator{V}=EuclideanMeanCentroid{V}(): Method to calculate cluster centroids.\nnormSqr::NormSqr{V}=EuclideanNormSqr{V}(): Squared norm function for distance calculations.\n\nReturns\n\nAbstractVector{Pair{V, AbstractVector{V}}}: A vector of pairs, where each pair consists of a cluster center and a vector of samples assigned to that center.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nExamples\n\n# Basic usage with default parameters\ndata = [rand(3) for _ in 1:100]  # 100 3D points\nresult = KMeans(data, 5)\n\n# Custom configuration\nresult = KMeans(data, 5,\n    init=KMeansPPInit{Vector{Float64}}(),\n    max_iter=500,\n    tol=1e-6,\n    algorithm=BkMeans{Vector{Float64}}(10, 0.001),\n    centroid=EuclideanMeanCentroid{Vector{Float64}}(),\n    normSqr=EuclideanNormSqr{Vector{Float64}}()\n)\n\nSee also ClusterInit, KMeansAlgorithm, CentroidCalculator, NormSqr\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Init.ClusterInit","page":"Home","title":"KMeansClustering.Init.ClusterInit","text":"ClusterInit{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}}\n\nAn abstract type representing cluster initialization strategies for clustering algorithms.\n\nThis type is parameterized by V, which can be either a non-integer numeric type or  an array of non-integer numeric types.\n\nPurpose\n\nSubtypes of ClusterInit are expected to implement specific initialization strategies  for clustering algorithms, such as k-means++ initialization, random initialization,  or other custom methods.\n\nExamples\n\n# A concrete subtype might be implemented as:\nstruct MyRandomInit{V<:AbstractVector{<:NonInteger}} <: ClusterInit{V} end\n\nSee also UniformRandomInit, KMeansPPInit\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Init.ClusterInit-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Init.ClusterInit","text":"(c::ClusterInit{V})(samples::AbstractVector{V}, k::Int64, normSqr::NormSqr{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nInitialize k cluster centers from samples using the strategy defined by c and the norm normSqr.\n\nThis is an abstract method that should be implemented by concrete subtypes of ClusterInit. If called on the abstract type, it raises an error.\n\nArguments\n\nsamples::AbstractVector{V}: Input data samples.\nk::Int64: Number of cluster centers to initialize.\nnormSqr::NormSqr{V}: Norm function to be used in the initialization process.\n\nReturns\n\nVector{V}: A vector of k initialized cluster centers.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nErrors\n\nThrows an error if the method is not implemented for the specific subtype of ClusterInit.\n\nExample\n\n# Implementing for a concrete subtype:\nfunction (c::MyCustomInit{V})(samples::AbstractVector{V}, k::Int64, normSqr::NormSqr{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n    # Custom initialization logic here\n    return initialize_centers(samples, k, normSqr)\nend\n\nSee also ClusterInit UniformRandomInit, KMeansPPInit end\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Init.KMeansPPInit","page":"Home","title":"KMeansClustering.Init.KMeansPPInit","text":"KMeansPPInit{V<:Union{AbstractArray{<:NonInteger},<:NonInteger}} <: ClusterInit{V}\n\nA concrete implementation of ClusterInit representing the k-means++ initialization strategy for clustering algorithms.\n\nThis struct implements the k-means++ initialization method, which selects initial cluster centers with a probability proportional to their squared distance from the closest center already chosen.\n\nType Parameters\n\nV<:Union{AbstractArray{<:NonInteger},<:NonInteger}: The type of input samples and cluster centers. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nExamples\n\n# Create an instance for vector data\nkmeans_pp_init = KMeansPPInit{Vector{Float64}}()\n\nSee also ClusterInit UniformRandomInit\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Init.KMeansPPInit-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Init.KMeansPPInit","text":"(c::KMeansPPInit{V})(samples::AbstractVector{V}, k::Int64, normSqr::NormSqr{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nPerform K-means++ initialization to select initial cluster centers.\n\nThis method implements the call operator for KMeansPPInit, allowing instances to be used as functions to generate initial cluster centers using the K-means++ algorithm.\n\nArguments\n\nsamples::AbstractVector{V}: Input data samples.\nk::Int64: Number of cluster centers to initialize.\nnormSqr::NormSqr{V}: Norm function used to calculate distances between points.\n\nReturns\n\nVector{V}: A vector of k initialized cluster centers.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nExamples\n\nkmeans_pp = KMeansPPInit{Vector{Float64}}()\nsamples = [rand(3) for _ in 1:100]  # 100 3D points\nk = 5\nnorm_sqr = EuclideanNormSqr{Vector{Float64}}()\ncenters = kmeans_pp(samples, k, norm_sqr)\n\nSee also ClusterInit UniformRandomInit, KMeansPPInit\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Init.UniformRandomInit","page":"Home","title":"KMeansClustering.Init.UniformRandomInit","text":"UniformRandomInit{V<:Union{AbstractArray{<:NonInteger},<:NonInteger}} <: ClusterInit{V}\n\nA concrete implementation of ClusterInit representing uniform random initialization for clustering algorithms.\n\nThis struct implements the uniform random initialization strategy, where initial cluster centers are chosen uniformly at random from the bounding hyperrectangle of the input samples.\n\nType Parameters\n\nV<:Union{AbstractArray{<:NonInteger},<:NonInteger}: The type of input samples and cluster centers. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nExamples\n\n# Create an instance for vector data\nuniform_init = UniformRandomInit{Vector{Float64}}()\n\nSee also ClusterInit, KMeansPPInit\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Init.UniformRandomInit-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Init.UniformRandomInit","text":"(c::UniformRandomInit{V})(samples::AbstractVector{V}, k::Int64, normSqr::NormSqr{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nInitialize k cluster centers from samples using uniform random distribution over the bounding hyperrectangle of the samples.\n\nThis method implements the call operator for UniformRandomInit, allowing instances to be used as functions to generate initial cluster centers.\n\nArguments\n\nsamples::AbstractVector{V}: Input data samples.\nk::Int64: Number of cluster centers to initialize.\nnormSqr::NormSqr{V}: Norm function (not used in this implementation but required for interface consistency).\n\nReturns\n\nVector{V}: A vector of k initialized cluster centers.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nExamples\n\nuniform_init = UniformRandomInit{Vector{Float64}}()\nsamples = [rand(3) for _ in 1:100]  # 100 3D points\nk = 5\nnorm_sqr = EuclideanNormSqr{Vector{Float64}}()\ncenters = uniform_init(samples, k, norm_sqr)\n\nSee also ClusterInit UniformRandomInit, KMeansPPInit\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.KMeansAlgorithms.BkMeans","page":"Home","title":"KMeansClustering.KMeansAlgorithms.BkMeans","text":"BkMeans{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}} <: KMeansAlgorithm{V}\n\nA concrete implementation of KMeansAlgorithm representing the BkMeans clustering algorithm.\n\nBkMeans is a variant of the K-means algorithm that aims to improve clustering quality by iteratively refining the solution through a process of \"breathing\" (adding and removing centers).\n\nType Parameters\n\nV<:Union{<:NonInteger,AbstractArray{<:NonInteger}}: The type of input samples and cluster centers. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nFields\n\nm::Int64: The number of centers to add and remove in each iteration. Default is 5.\neps::Float64: A small value used in the center perturbation step. Default is 0.001.\n\nConstructor\n\nBkMeans{V}(m::Int64 = 5, eps::Float64 = 0.001) where V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}\n\nConstructs a BkMeans instance with the specified parameters.\n\nArguments\n\nm::Int64: The number of centers to add and remove in each iteration. Must be non-negative.\neps::Float64: A small value used in the center perturbation step. Must be non-negative.\n\nThrows\n\nArgumentError: If either m or eps is negative.\n\nExamples\n\n# Create an instance for vector data with default parameters\nbkmeans = BkMeans{Vector{Float64}}()\n\n# Create an instance with custom parameters\nbkmeans_custom = BkMeans{Vector{Float64}}(10, 0.0005)\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.KMeansAlgorithms.BkMeans-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, ClusterInit{V}, Int64, Float64, CentroidCalculator{V}, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeansAlgorithms.BkMeans","text":"(a::BkMeans{V})(samples::AbstractVector{V}, k::Int64, init::ClusterInit{V}, max_iter::Int64, tol::Float64, centroid::CentroidCalculator{V}, normSqr::NormSqr{V})::AbstractVector{Pair{V, AbstractVector{V}}} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nExecute the BkMeans clustering algorithm on the given samples.\n\nThis method implements the call operator for BkMeans, allowing instances to be used as functions to perform K-means clustering using the BkMeans algorithm variant. BkMeans aims to improve clustering quality by iteratively refining the solution through a process of \"breathing\" (adding and removing centers).\n\nArguments\n\nsamples::AbstractVector{V}: Input data samples to be clustered.\nk::Int64: Number of clusters to form.\ninit::ClusterInit{V}: Initialization method for cluster centers.\nmax_iter::Int64: Maximum number of iterations for the algorithm.\ntol::Float64: Convergence tolerance.\ncentroid::CentroidCalculator{V}: Method to calculate cluster centroids.\nnormSqr::NormSqr{V}: Squared norm function for distance calculations.\n\nReturns\n\nAbstractVector{Pair{V, AbstractVector{V}}}: A vector of pairs, where each pair consists of a cluster center and a vector of samples assigned to that center.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nExamples\n\nbkmeans = BkMeans{Vector{Float64}}(5, 0.001)\nsamples = [rand(3) for _ in 1:100]  # 100 3D points\nk = 5\ninit = KMeansPPInit{Vector{Float64}}()\nmax_iter = 100\ntol = 1e-4\ncentroid = EuclideanMeanCentroid{Vector{Float64}}()\nnorm_sqr = EuclideanNormSqr{Vector{Float64}}()\nresults = bkmeans(samples, k, init, max_iter, tol, centroid, norm_sqr)\n\nSee also KMeansAlgorithm, Lloyd, BkMeans\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.KMeansAlgorithms.KMeansAlgorithm","page":"Home","title":"KMeansClustering.KMeansAlgorithms.KMeansAlgorithm","text":"KMeansAlgorithm{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}}\n\nAn abstract type representing K-means clustering algorithms.\n\nThis type is parameterized by V, which can be either a non-integer numeric type or  an array of non-integer numeric types, representing the type of data points being clustered.\n\nType Parameters\n\nV<:Union{<:NonInteger,AbstractArray{<:NonInteger}}: The type of the data points. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nPurpose\n\nSubtypes of KMeansAlgorithm are expected to implement specific variants of the  K-means clustering algorithm, such as Lloyd's algorithm, mini-batch K-means, or  other custom methods.\n\nExamples\n\n# A concrete subtype might be implemented as:\nstruct MyAlgorithm{V<:AbstractVector{<:NonInteger}} <: KMeansAlgorithm{V} end\n\nSee also Lloyd, BkMeans\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.KMeansAlgorithms.KMeansAlgorithm-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, ClusterInit{V}, Int64, Float64, CentroidCalculator{V}, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeansAlgorithms.KMeansAlgorithm","text":"(a::KMeansAlgorithm{V})(samples::AbstractVector{V}, k::Int64, init::ClusterInit{V}, max_iter::Int64, tol::Float64, centroid::CentroidCalculator{V}, normSqr::NormSqr{V})::AbstractVector{Pair{V, AbstractVector{V}}} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nExecute a K-means clustering algorithm on the given samples.\n\nThis is an abstract method that should be implemented by concrete subtypes of KMeansAlgorithm. If called on the abstract type, it raises an error.\n\nArguments\n\nsamples::AbstractVector{V}: Input data samples to be clustered.\nk::Int64: Number of clusters to form.\ninit::ClusterInit{V}: Initialization method for cluster centers.\nmax_iter::Int64: Maximum number of iterations for the algorithm.\ntol::Float64: Convergence tolerance.\ncentroid::CentroidCalculator{V}: Method to calculate cluster centroids.\nnormSqr::NormSqr{V}: Squared norm function for distance calculations.\n\nReturns\n\nAbstractVector{Pair{V, AbstractVector{V}}}: A vector of pairs, where each pair consists of a cluster center and a vector of samples assigned to that center.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nErrors\n\nThrows an error if the method is not implemented for the specific subtype of KMeansAlgorithm.\n\nExample\n\n# Implementing for a concrete subtype:\nfunction (a::MyCustomKMeans{V})(samples::AbstractVector{V}, k::Int64, init::ClusterInit{V}, max_iter::Int64, tol::Float64, centroid::CentroidCalculator{V}, normSqr::NormSqr{V})::AbstractVector{Pair{V, AbstractVector{V}}} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n    # Custom K-means algorithm implementation\n    return cluster_results\nend\n\nSee also KMeansAlgorithm, Lloyd, BkMeans\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.KMeansAlgorithms.Lloyd","page":"Home","title":"KMeansClustering.KMeansAlgorithms.Lloyd","text":"Lloyd{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}} <: KMeansAlgorithm{V}\n\nA concrete implementation of KMeansAlgorithm representing Lloyd's algorithm for K-means clustering.\n\nLloyd's algorithm, also known as the standard K-means algorithm, iteratively reassigns points  to the nearest cluster center and recalculates cluster centers until convergence or a maximum  number of iterations is reached.\n\nType Parameters\n\nV<:Union{<:NonInteger,AbstractArray{<:NonInteger}}: The type of input samples and cluster centers. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nExamples\n\n# Create an instance for vector data\nlloyd_kmeans = Lloyd{Vector{Float64}}()\n\nSee also KMeansAlgorithm, BkMeans\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.KMeansAlgorithms.Lloyd-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, ClusterInit{V}, Int64, Float64, CentroidCalculator{V}, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeansAlgorithms.Lloyd","text":"(a::Lloyd{V})(samples::AbstractVector{V}, k::Int64, init::ClusterInit{V}, max_iter::Int64, tol::Float64, centroid::CentroidCalculator{V}, normSqr::NormSqr{V})::AbstractVector{Pair{V, AbstractVector{V}}} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nExecute Lloyd's K-means clustering algorithm on the given samples.\n\nThis method implements the call operator for Lloyd, allowing instances to be used as functions to perform K-means clustering using Lloyd's algorithm.\n\nArguments\n\nsamples::AbstractVector{V}: Input data samples to be clustered.\nk::Int64: Number of clusters to form.\ninit::ClusterInit{V}: Initialization method for cluster centers.\nmax_iter::Int64: Maximum number of iterations for the algorithm.\ntol::Float64: Convergence tolerance.\ncentroid::CentroidCalculator{V}: Method to calculate cluster centroids.\nnormSqr::NormSqr{V}: Squared norm function for distance calculations.\n\nReturns\n\nAbstractVector{Pair{V, AbstractVector{V}}}: A vector of pairs, where each pair consists of a cluster center and a vector of samples assigned to that center.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and cluster centers.\n\nThrows\n\nArgumentError: If k ≤ 0 or if k is greater than the number of samples.\n\nExamples\n\nlloyd = Lloyd{Vector{Float64}}()\nsamples = [rand(3) for _ in 1:100]  # 100 3D points\nk = 5\ninit = KMeansPPInit{Vector{Float64}}()\nmax_iter = 100\ntol = 1e-4\ncentroid = EuclideanMeanCentroid{Vector{Float64}}()\nnorm_sqr = EuclideanNormSqr{Vector{Float64}}()\nresults = lloyd(samples, k, init, max_iter, tol, centroid, norm_sqr)\n\nSee also KMeansAlgorithm, Lloyd, BkMeans\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.KMeansAlgorithms.buildClusters-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, AbstractVector{V}, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeansAlgorithms.buildClusters","text":"buildClusters(xs::AbstractVector{V}, init::AbstractVector{V}, normSqr::NormSqr{V})::Vector{Vector{V}} where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nAssigns each sample in xs to the nearest cluster center in init.\n\nReturns a vector of clusters, where each cluster is a vector of samples.\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Norm.EuclideanNormSqr","page":"Home","title":"KMeansClustering.Norm.EuclideanNormSqr","text":"EuclideanNormSqr{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}} <: NormSqr{V}\n\nA concrete implementation of NormSqr representing the squared Euclidean norm.\n\nType Parameters\n\nV<:Union{<:NonInteger,AbstractArray{<:NonInteger}}: The type of input for which this norm is defined.\n\nExamples\n\n# Create an instance\neuclidean_norm_sqr = EuclideanNormSqr{Vector{Float64}}()\n\nSee also: NormSqr\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Norm.EuclideanNormSqr-Union{Tuple{V}, Tuple{N}, Tuple{T}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Norm.EuclideanNormSqr","text":"(c::EuclideanNormSqr{V})(x::V)::T where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nCompute the squared Euclidean norm of x.\n\nThis method implements the call operator for EuclideanNormSqr, allowing instances to be used as functions to calculate squared Euclidean norms.\n\nReturns\n\nT: The computed squared Euclidean norm, which is a non-integer numeric type.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements and the result.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input, either a scalar or an array.\n\nExamples\n\neuclidean_norm_sqr = EuclideanNormSqr{Vector{Float64}}()\nv = [3.0, 4.0]\nresult = euclidean_norm_sqr(v)  # Returns 25.0\n\nSee also: NormSqr\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Norm.NormSqr","page":"Home","title":"KMeansClustering.Norm.NormSqr","text":"NormSqr{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}}\n\nAn abstract type representing squared norms.\n\nThe type parameter V can be either a non-integer numeric type or an array of non-integer numeric types. This allows for representation of squared norms of scalars, vectors, or matrices with non-integer elements.\n\nExamples\n\n```julia\n\nConcrete subtypes might be implemented as:\n\nstruct MyNormSqr{V<:AbstractVector{<:NonInteger}} <: NormSqr{V}\n\nmyParameter::Any\n\nend\n\nSee also: EuclideanNormSqr\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Norm.NormSqr-Union{Tuple{V}, Tuple{N}, Tuple{T}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Norm.NormSqr","text":"(c::NormSqr{V})(x::V)::T where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nCompute the squared norm of x using the norm represented by c.\n\nReturns\n\nT: The computed squared norm, which is a non-integer numeric type.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements and the result.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input, either a scalar or an array.\n\nThis is an abstract method that should be implemented by concrete subtypes of NormSqr. If called on the abstract type, it raises an error.\n\nErrors\n\nThrows an error if the method is not implemented for the specific subtype of NormSqr.\n\nExample\n\nfunction (c::MyNormSqr{V})(x::V)::T where V<:AbstractVector{<:NonInteger}\n    return sum(abs, x)\nend\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Centroid.CentroidCalculator","page":"Home","title":"KMeansClustering.Centroid.CentroidCalculator","text":"CentroidCalculator{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}}\n\nAn abstract type representing methods for calculating centroids in clustering algorithms.\n\nThis type is parameterized by V, which can be either a non-integer numeric type or  an array of non-integer numeric types, representing the type of data points for which  centroids are being calculated.\n\nType Parameters\n\nV<:Union{<:NonInteger,AbstractArray{<:NonInteger}}: The type of the data points. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nPurpose\n\nSubtypes of CentroidCalculator can be used to implement different ways of calculating the centroid for k-Means.\n\nExamples\n\n# A concrete subtype might be implemented as:\nstruct CustomCentroid{V<:AbstractVector{<:NonInteger}} <: CentroidCalculator{V} end\n\nSee also EuclideanMeanCentroid\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Centroid.CentroidCalculator-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Centroid.CentroidCalculator","text":"(c::CentroidCalculator{V})(samples::AbstractVector{V}, normSqr::NormSqr{V})::V where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nCalculate the center of a cluster from the given samples using the provided normSqr.\n\nThis is an abstract method that should be implemented by concrete subtypes of CentroidCalculator. If called on the abstract type, it raises an error.\n\nArguments\n\nsamples::AbstractVector{V}: A vector of data points in the cluster.\nnormSqr::NormSqr{V}: The squared norm function used for distance calculations.\n\nReturns\n\nV: The calculated center of the cluster.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and the returned center.\n\nErrors\n\nThrows an error if the method is not implemented for the specific subtype of CentroidCalculator.\n\nExample\n\nfunction (c::CustomCentroid{V})(samples::AbstractVector{V}, normSqr::NormSqr{V})::V where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n    return samples[1]\nend\n\nSee also CentroidCalculator, EuclideanMeanCentroid\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Centroid.EuclideanMeanCentroid","page":"Home","title":"KMeansClustering.Centroid.EuclideanMeanCentroid","text":"EuclideanMeanCentroid{V<:Union{<:NonInteger,AbstractArray{<:NonInteger}}} <: CentroidCalculator{V}\n\nA concrete implementation of CentroidCalculator that calculates the centroid of a cluster  using the Euclidean mean (arithmetic average) of the sample points.\n\nThis centroid calculator is suitable for use with Euclidean distance-based clustering algorithms.\n\nType Parameters\n\nV<:Union{<:NonInteger,AbstractArray{<:NonInteger}}: The type of input samples and calculated centroids. Can be either a non-integer numeric type or an array of non-integer numeric types.\n\nExamples\n\n# Create an instance for vector data\neuclidean_mean = EuclideanMeanCentroid{Vector{Float64}}()\n\nSee also CentroidCalculator\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.Centroid.EuclideanMeanCentroid-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, NormSqr{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Centroid.EuclideanMeanCentroid","text":"(c::EuclideanMeanCentroid{V})(samples::AbstractVector{V}, normSqr::NormSqr{V})::V where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nCalculate the centroid of a cluster using the standard Euclidean mean (arithmetic average) of the sample points.\n\nThis method implements the call operator for EuclideanMeanCentroid, allowing instances to be used as functions to compute cluster centroids.\n\nArguments\n\nsamples::AbstractVector{V}: A vector of data points in the cluster.\nnormSqr::NormSqr{V}: The squared norm function (not used in this implementation but required for interface consistency).\n\nReturns\n\nV: The calculated centroid of the cluster, which is the arithmetic mean of all points.\n\nType Parameters\n\nT<:NonInteger: The numeric type of the elements.\nN: The number of dimensions if V is an array type.\nV<:Union{T,AbstractArray{T,N}}: The type of the input samples and the returned centroid.\n\nExamples\n\neuclidean_mean = EuclideanMeanCentroid{Vector{Float64}}()\nsamples = [rand(3) for _ in 1:10]  # 10 3D points\nnorm_sqr = EuclideanNormSqr{Vector{Float64}}()\ncentroid = euclidean_mean(samples, norm_sqr)\n\nSee also CentroidCalculator, EuclideanMeanCentroid\n\n\n\n\n\n","category":"method"}]
}
