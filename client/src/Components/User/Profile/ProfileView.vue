<template>
    

         
              <div class="card2">
                    <div class="container-fliud">
                        <div class="wrapper row">
                            <div class="preview col-md-6">
                                
                                <div class="preview-pic tab-content">
                                  <div class="tab-pane active" id="pic-1"><img src="images/<%= locals.user.usr_pseudo %>/escargot.jpeg" /></div>
                                  <div class="tab-pane" id="pic-2"><img src="images/<%= locals.user.usr_pseudo %>/300.jpeg" /></div>
                                  <div class="tab-pane" id="pic-3"><img src="images/<%= locals.user.usr_pseudo %>/test.jpg" /></div>
                                  <div class="tab-pane" id="pic-4"><img src="images/<%= locals.user.usr_pseudo %>/mqdefault.jpg" /></div>
                                  <div class="tab-pane" id="pic-5"><img src="images/<%= locals.user.usr_pseudo %>/poisson-clown.jpg" /></div>
                                </div>
                                <ul class="preview-thumbnail nav nav-tabs">
                                  <li class="active"><a data-target="#pic-1" data-toggle="tab"><img src="images/<%= locals.user.usr_pseudo %>/escargot.jpeg" /></a></li>
                                  <li><a data-target="#pic-2" data-toggle="tab"><img src="images/<%= locals.user.usr_pseudo %>/300.jpeg" /></a></li>
                                  <li><a data-target="#pic-3" data-toggle="tab"><img src="images/<%= locals.user.usr_pseudo %>/test.jpg" /></a></li>
                                  <li><a data-target="#pic-4" data-toggle="tab"><img src="images/<%= locals.user.usr_pseudo %>/mqdefault.jpg" /></a></li>
                                  <li><a data-target="#pic-5" data-toggle="tab"><img src="images/<%= locals.user.usr_pseudo %>/poisson-clown.jpg" /></a></li>
                                </ul>
                                
                            </div>
                            <div class="details col-md-6">
                                    <h4 class="price">Popularité : <span>235 </span> </h4>
                                <div class="rating">
                                    <div class="stars">
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                    </div>
                                    <span class="review-no">41 vues</span>
                                </div>
                                <p class="product-description">{{user.resume}}</p>
                                
                                <hr>
                                
                             
                             

                            </div>
                        </div>
             <hr />
    
            </div>

            <!-- Sidebar Widgets Column -->
            <div class="col-md-4" id="infos">     



                
                <!-- Categories Widget -->
                <div class="card my-4">
                    <h5 class="card-header">Vos informations <span style="float:right"><a href="/interface/infos"><i class="fas fa-edit"></i></a></span></h5>
                    <div class="card-body">
                        <div class="row">
                          
                                <p class="vote">Code Postal : <strong> </strong>
                                    <br />Ville : <strong> </strong> 
                                    <br />E-mail : <strong></strong></p>
            </div>
        </div>
    </div>    
</div>

</div><!-- /.row -->
</template>

<script>
  export default {
    props: ['mode', 'user']
  }
</script>
