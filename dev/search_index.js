var documenterSearchIndex = {"docs":
[{"location":"getting_started/#Two-Dimensions-(Sepal-Length-and-Width)-Example-of-Iris-Data","page":"Getting Started","title":"Two Dimensions (Sepal Length and Width) Example of Iris Data","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"This is a simple example with real world data on how to use KMeans Clustering and visualize the clusters.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"The process consists of four main steps:","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"Data Loading - Iris Data\nData Preprocessing - Extract required data and convert to required data format\nKMeans Clustering Execution - KMean and KMean++\nResults Visualization - 2D Plot","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"using KMeansClustering\nusing MLJ\nusing DataFrames\nusing Plots\nENV[\"GKSwstype\"] = \"100\" # hide\ngr() # hide\n\n# Load Iris data\nmodels() \ndata = load_iris()\niris = DataFrame(data)\ny_iris, X_iris = unpack(iris, ==(:target); rng=123);\n\n# Extract sepal_length and sepal_width features from Iris dataset\n# Convert selected features to a vector for KMeans clustering\nX_iris = Matrix(X_iris[:, 1:2])'\nX_iris_vec = [Vector{Float64}(col) for col in eachcol(X_iris)]\n\n# Execute KMeans clustering\nk = 3\nmax_iter = 100\ntol = 0.0001\nInitializer = KMeansPPInit{Vector{Float64}}()\nclusters = KMeans(X_iris_vec, k; init = Initializer, max_iter = max_iter, tol = tol)\nclusters # hide","category":"page"},{"location":"getting_started/#Visualization","page":"Getting Started","title":"Visualization","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"# Plot the result\np = plot(title=\"Two Dimension KMean - Iris\", xlabel=\"sepal_length\", ylabel=\"sepal_width\", legend=:topright)\ncolor_palette = palette(:tab10)\n\nfor (i, (centers, members)) in enumerate(clusters)\n\n    mem_x = [members[i][1] for i in 1:length(members)]\n    mem_y = [members[i][2] for i in 1:length(members)]\n    \n    # Plot cluster points\n    scatter!(p, mem_x, mem_y, label=\"Cluster $i\", color=color_palette[i])\n    \n    # Plot cluster center\n    scatter!(p, [centers[1]], [centers[2]], color=color_palette[i], marker=:star, markersize=10, label=\"Center $i\")\n\nend\nsavefig(p, \"two_dim_kmeans_iris.svg\"); nothing # hide","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"getting_started/#High-Dimensions-Example-of-Wine-Data","page":"Getting Started","title":"High Dimensions Example of Wine Data","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"This example illustrates the application of KMeans Clustering to high-dimensional, real-world data, demonstrating how the algorithm partitions and visualizes complex datasets into distinct clusters.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"The process consists of four main steps:","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"Data Loading - Wine Data\nData Preprocessing - Normalize and convert to required data format\nKMeans Clustering Execution - KMean and KMean++\nResults Visualization - t-SNE to 2D Plot","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"using KMeansClustering\nusing TSne\nusing HTTP\nusing CSV\nusing DataFrames\nusing MLJ\nusing Plots\nENV[\"GKSwstype\"] = \"100\" # hide\ngr() # hide\n\n# Load wine data\n# There are 13 features: Alcohol,Malic.acid,Ash,Acl,Mg,Phenols,Flavanoids,Nonflavanoid.phenols,Proanth,Color.int,Hue,OD,Proline\ndata_path = \".\\\\wine.csv\"\nurl = \"https://gist.githubusercontent.com/tijptjik/9408623/raw/b237fa5848349a14a14e5d4107dc7897c21951f5/wine.csv\"\nHTTP.download(url, data_path)\n\nwine_df = CSV.read(data_path, DataFrame)\ny_wine, X_wine = unpack(wine_df, ==(:Wine); rng=123);\n\nX_wine = Matrix(X_wine)'\n\n# Normalize\nX_normalized = (X_wine .- mean(X_wine, dims=1)) ./ std(X_wine, dims=1)\n\n# Convert to vector\nX_normalized_vec = [Vector{Float64}(col) for col in eachcol(X_normalized)]\n\n# Execute KMeans clustering\nk = 3\nmax_iter = 100\ntol = 0.0001\nInitializer = KMeansPPInit{Vector{Float64}}()\nclusters = KMeans(X_normalized_vec, k; init = Initializer, max_iter = max_iter, tol = tol)\nclusters # hide","category":"page"},{"location":"getting_started/#Visualization-2","page":"Getting Started","title":"Visualization","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"We use t-SNE to do dimension reduction for visulization. ","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"t-SNE (t-Distributed Stochastic Neighbor Embedding) is a powerful dimensionality reduction and data visualization technique used in machine learning and data science.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"# Extract and combine centers and clusters for the purpose of using t-SNE\ncombined_centers_clusters = Matrix{Float64}(undef, 0, length(first(first(clusters)[2])))\ncenters_index = Int[]\nglobal count_index = 1\nfor (i, (centers, members)) in enumerate(clusters)\n    global combined_centers_clusters = vcat(combined_centers_clusters, centers')\n    push!(centers_index, count_index)\n    \n    for member in members\n        global combined_centers_clusters = vcat(combined_centers_clusters, member')\n        global count_index += 1\n    end\n    \n    global count_index += 1\nend\n\n# Execute t-SNE\ntsne_result = tsne(combined_centers_clusters, 2, 50, 1000, 20.0);\n\n# Convert to vector\ntsne_result_vec = [Vector{Float64}(col) for col in eachcol(tsne_result')]\n\n# Plot the result\np = plot(title=\"High Dimension KMean - Wine\", xlabel=\"t-SNE 1\", ylabel=\"t-SNE 2\", legend=:topright)\ncolor_palette = palette(:tab10)\n\nfor i in 1:k\n    tsne_result_members = []\n     \n    for j in (centers_index[i]+1):(i != k ? (centers_index[i+1]-1) : length(tsne_result_vec) )\n        push!(tsne_result_members, tsne_result_vec[j])\n    end\n\n    # Plot cluster points\n    mem_x = [tsne_result_members[m][1] for m in 1:length(tsne_result_members)]\n    mem_y = [tsne_result_members[m][2] for m in 1:length(tsne_result_members)]\n\n    scatter!(p, mem_x, mem_y, color=color_palette[i] , label=\"Cluster $i\")\n    \n    # Plot cluster center\n    scatter!(p, ([tsne_result_vec[centers_index[i]]][1][1], [tsne_result_vec[centers_index[i]]][1][2]), color=color_palette[i], marker=:star, markersize=10, label=\"Center $i\")\nend\n\nsavefig(p, \"high_dim_kmeans_wine.svg\"); nothing # hide","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"installation/#Installation","page":"Installation","title":"Installation","text":"","category":"section"},{"location":"installation/","page":"Installation","title":"Installation","text":"You can install KMeansClustering.jl by adding it directly from our GitHub repository. Here are the steps:","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"Open Julia's REPL (the Julia command-line interface).\nPress ] to enter Pkg mode (the prompt should change to pkg>).\nRun the following command to add KMeansClustering.jl:","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"pkg> add https://github.com/idil-tub/KMeansClustering.jl.git","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"Once installed, you can import the package and start using it.","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"using KMeansClustering","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = KMeansClustering","category":"page"},{"location":"#KMeansClustering","page":"Home","title":"KMeansClustering","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for KMeansClustering.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [KMeansClustering]","category":"page"},{"location":"#KMeansClustering.CentroidCalculator-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, KMeansClustering.Norm{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.CentroidCalculator","text":"(c::CentroidCalculator{V})(samples::AbstractVector{V}, norm::Norm{V})::V where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nCalculates the center from the samples using norm. Overwrite in your subtypes of CentroidCalculator\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.ClusterInit-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, KMeansClustering.Norm{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.ClusterInit","text":"(c::ClusterInit{V})(samples::AbstractVector{V}, k::Int64, norm::Norm{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nInitializes k cluster centers from samples using the cluster initialization method c. Overwrite in your subtypes of ClusterInit\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.EuclideanMeanCentroid-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, KMeansClustering.Norm{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.EuclideanMeanCentroid","text":"(c::EuclideanMeanCentroid{V})(samples::AbstractVector{V}, norm::Norm{V})::V where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nCalculates the center from the samples using the standard euclidean mean.\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.EuclideanNorm-Union{Tuple{V}, Tuple{N}, Tuple{T}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.EuclideanNorm","text":"(c::EuclideanNorm{V})(x::V)::T where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nCalculates the euclidean norm of x. \n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.KMeansPPInit-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64, KMeansClustering.Norm{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeansPPInit","text":"(c::KMeansPPInit{V})(samples::AbstractVector{V}, k::Int64, norm::Norm{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nPerform K-means++ initialization to select initial cluster centers.\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.Norm-Union{Tuple{V}, Tuple{N}, Tuple{T}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.Norm","text":"(c::Norm{V})(x::V)::T where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nCalculates the norm of x. Overwrite in your own subtypes of Norm.\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.UniformRandomInit","page":"Home","title":"KMeansClustering.UniformRandomInit","text":"(c::UniformRandomInit{V})(samples::AbstractVector{V}, k::Int64, norm::Norm{V})::Vector{V} where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nInitializes k cluster centers from samples using a uniform random distribution, over the bounding hyperrectangle of the samples\n\n\n\n\n\n","category":"type"},{"location":"#KMeansClustering.KMeans-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, Int64}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.KMeans","text":"KMeans(x::AbstractVector{V}, k::Int64; init::ClusterInit{V}=UniformRandomInit{V}(), max_iter=300, tol=0.0001, algorithm::KMeansAlgorithm=Lloyd, centroid::CentroidCalculator{V}=EuclideanMeanCentroid{V}(), norm::Norm{V}=EuclideanNorm{V}())::AbstractVector{Pair{V, AbstractVector{V}}} where {T<:NonInteger,N,V<:Union{T,AbstractArray{T,N}}}\n\nPerform K-means clustering on the data x with k clusters.\n\nArguments:\n\nx: Input data as an abstract vector of type V.\nk: Number of clusters.\ninit: Cluster initialization method. Default is UniformRandomInit.\nmax_iter: Maximum number of iterations. Default is 300.\ntol: Tolerance for convergence. Default is 0.0001.\nalgorithm: K-means algorithm to use. Default is Lloyd.\ncentroid: Used to calculate center of each cluster. Default EuclideanMeanCentroid\nnorm: Used to assign clusters to samples. Default EuclideanNorm\n\nReturns a dictionary mapping each cluster center to its assigned samples.\n\n\n\n\n\n","category":"method"},{"location":"#KMeansClustering.buildClusters-Union{Tuple{V}, Tuple{N}, Tuple{T}, Tuple{AbstractVector{V}, AbstractVector{V}, KMeansClustering.Norm{V}}} where {T<:Real, N, V<:Union{AbstractArray{T, N}, T}}","page":"Home","title":"KMeansClustering.buildClusters","text":"buildClusters(xs::AbstractVector{V}, init::AbstractVector{V}, norm::Norm{V})::Vector{Vector{V}} where {T<:NonInteger,N,V<:Union{T, AbstractArray{T,N}}}\n\nAssigns each sample in xs to the nearest cluster center in init.\n\nReturns a vector of clusters, where each cluster is a vector of samples.\n\n\n\n\n\n","category":"method"}]
}
