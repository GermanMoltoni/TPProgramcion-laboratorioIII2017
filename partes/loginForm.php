
<script>
	 $("#loginForm").bootstrapValidator({
                feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-zoom-in'
                },
                fields: {
                    id:{validators:{
						notEmpty:{message:'Ingrese Id'},
						integer:{message:'Ingrese Id Valido'}
					}},
                    password:{validators:{
						notEmpty:{message:'Ingrese contraseña'},
                        stringLength: {min: 6,max: 8,message:'Ingrese entre 6 y 8 caracteres'},
                    }
                }
                
            
            }});
	</script>
<div class="login-form" id="loginForm">
<div class="panel panel-default">
					<div class="panel-heading">USER LOGIN</div>
					<div class="panel-body">
					    
						
						<div class="form-group">
							
        					<input type="text" id="id" class="form-control input-lg" placeholder="Id" required>
        					</div>
							<div class="form-group">
							<input type="password" id="passwd" class="form-control input-lg" placeholder="Password" required>
							</div>
							<div class="form-links">
							<label><input type="checkbox" id="remember" class="text-primary" name="remember" value="yes">Remember me</label>
							</div>
							<button type="submit" name="go" id="Login" onclick=login() class="btn btn-lg btn-info btn-block">SIGN IN</button>
							<div class="form-links">
								<span class="glyphicon glyphicon-question-sign text-primary"></span> <a href="#">Forgot your password ?</a><br/>
							</div>
							
						
					</div>
				</div>
			</div>	
	</div>

